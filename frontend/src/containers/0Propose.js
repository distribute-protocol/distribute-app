import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapboxgl from 'mapbox-gl'
import { proposeProject } from '../actions/projectActions'
import ProposePage from '../components/Propose'
import Sidebar from '../components/shared/Sidebar'
import { push } from 'react-router-redux'
import {eth, web3, tr, rr, dt, P} from '../utilities/blockchain'
import * as _ from 'lodash'
import moment from 'moment'
import ipfsAPI from 'ipfs-api'
import MapboxClient from 'mapbox/lib/services/geocoding'
const client = new MapboxClient('pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA')
mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA'
let ipfs = ipfsAPI()
window.moment = moment

const WAIT_INTERVAL = 1500

class Propose extends Component {
  constructor () {
    super()
    this.state = {
      tempProject: {},
      currPrice: 0,
      loading: false,
      imageUrl: false,
      location: [0, 0]
    }
    this.proposeProject = this.proposeProject.bind(this)
    this.getContractValues = this.getContractValues.bind(this)
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.triggerChange = this.triggerChange.bind(this)
  }

  componentWillMount () {
    if (_.isEmpty(this.props.user)) {
      // this.props.reroute()
    }
    this.getContractValues()
    this.timer = null
  }

  componentDidMount () {
    console.log('component did mount')
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v10'
      // style: 'mapbox://styles/consensys/cj8ppygty9tga2smvqxtu8vqw'
    })
    this.setState({map: map})
    let coordHandler = (pos) => {
      let ll = new mapboxgl.LngLat(pos.coords.longitude, pos.coords.latitude)
      map.setCenter(ll)
      map.setZoom(12)
      map.addControl(new mapboxgl.NavigationControl())
      map.on('click', function (e) {
        map.setCenter(e.lngLat)
        this.setState({coords: e.lngLat})
      })
    }
    window.navigator.geolocation.getCurrentPosition(coordHandler)
  }

  componentWillUnmount () {
    this.state.map.remove()
  }

  async getContractValues () {
    let currPrice = (await dt.currentPrice()).toNumber()
    let weiBal = (await dt.weiBal()).toNumber()
    let totalReputationSupply = (await rr.totalSupply()).toNumber()
    this.setState({
      currPrice,
      weiBal,
      totalReputationSupply
    })
  }

  async proposeProject (type, values) {
    // stakingPeriod in Days changed to seconds -> blockchain understands seconds
    let projObj = {
      cost: this.state.cost,
      stakingEndDate: Math.floor(values.date.valueOf() / 1000),
      photo: this.state.photo,
      name: values.name,
      location: this.state.coords,
      summary: values.summary
    }
    let multiHash
    const obj = {
      Data: JSON.stringify(projObj),
      Links: []
    }
    let receiptHandler = (tx, multiHash) => {
      let txReceipt = tx.receipt
      let projectAddress = '0x' + txReceipt.logs[1].topics[1].slice(txReceipt.logs[1].topics[1].length - 40, (txReceipt.logs[1].topics[1].length))
      this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress, ipfsHash: `https://ipfs.io/ipfs/${multiHash}`}))
      this.setState({cost: 0, photo: false, imageUrl: false, coords: 0, location: ''})
    }

    await ipfs.object.put(obj, {enc: 'json'}, (err, node) => {
      if (err) {
        throw err
      }
      multiHash = node.toJSON().multihash
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          if (type === 'tokens') {
            await tr.proposeProject(projObj.cost, projObj.stakingEndDate, multiHash, {from: accounts[0]}).then(tx => receiptHandler(tx, multiHash))
          } else if (type === 'reputation') {
            await rr.proposeProject(projObj.cost, projObj.stakingEndDate, multiHash, {from: accounts[0]}).then(tx => receiptHandler(tx, multiHash))
          }
        }
      })
    })
  }

  handleChange (info) {
  // if (info.file.status === 'uploading') {
  //   this.setState({ loading: true })
  //   return
  // }
  // if (info.file.status === 'done') {
    // Get this url from response in real world.

    this.handlePhotoUpload(info.file.originFileObj)
    this.getBase64(info.file.originFileObj, imageUrl => this.setState({
      imageUrl
      // loading: false,
    }))
    this.setState({loading: true})
  // }
  }

  handlePhotoUpload (photoObj) {
    const reader = new FileReader()
    reader.onloadend = () => {
      const buf = Buffer.from(reader.result) // Convert data into buffer
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if (err) {
          console.error(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        // console.log(`Url --> ${url}`)
        this.setState({photo: url, loading: false})
      })
    }
    reader.readAsArrayBuffer(photoObj) // Read Provided File
  }

  getBase64 (img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  handlePriceChange (val) {
    this.setState({cost: web3.toWei(val.target.value, 'ether')})
  }

  handleLocationChange (val) {
    clearTimeout(this.timer)
    this.setState({location: val.target.value})
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL)
  }

  triggerChange () {
    const { location } = this.state
    client.geocodeForward(location, (err, data, res) => {
      if (err) { console.error(err) }
      console.log(this.state)
      this.state.map.setCenter(data.features[0].geometry.coordinates)
      this.state.map.setZoom(18)
      new mapboxgl.Marker()
        .setLngLat(data.features[0].geometry.coordinates)
        .addTo(this.state.map)
      this.setState({coords: data.features[0].geometry.coordinates})
    })
  }

  render () {
    console.log('render', this.mapContainer, this.state.map)
    return (
      <div>
        <Sidebar />
        <ProposePage
          handleChange={this.handleChange}
          imageUrl={this.state.imageUrl}
          loading={this.state.loading}
          cost={typeof this.state.cost === 'undefined'
            ? 0
            : Math.ceil(this.state.cost / 20 / this.state.currPrice)}
          reputationCost={typeof this.state.cost === 'undefined'
            ? 0
            : Math.ceil(this.state.cost / this.state.weiBal * this.state.totalReputationSupply / 20)}
          handlePriceChange={this.handlePriceChange}
          handleLocationChange={this.handleLocationChange}
          proposeProject={this.proposeProject}
          map={<div id='map' style={{width: 400, height: 400}} ref={el => { this.mapContainer = el; return }} />}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proposeProject: (projectDetails) => dispatch(proposeProject(projectDetails)),
    reroute: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Propose)
