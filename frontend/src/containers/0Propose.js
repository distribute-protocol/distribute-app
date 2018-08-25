/* global FileReader */

import React from 'react'
import { connect } from 'react-redux'
import mapboxgl from 'mapbox-gl'
import { getNetworkStatus } from '../actions/networkActions'
import { proposeProject } from '../actions/projectActions'
import ProposeForm from '../components/Propose'
import Sidebar from '../components/shared/Sidebar'
import {eth, web3, dt} from '../utilities/blockchain'
import ipfs from '../utilities/ipfs'
import MapboxClient from 'mapbox/lib/services/geocoding'
const client = new MapboxClient('pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA')
mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA'

const WAIT_INTERVAL = 1500

class Propose extends React.Component {
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
    this.handlePhotoChange = this.handlePhotoChange.bind(this)
    this.triggerMapChange = this.triggerMapChange.bind(this)
  }

  componentWillMount () {
    this.getContractValues()
    this.getNetworkStatus()
    this.timer = null
  }

  componentDidMount () {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v10'
    })
    this.setState({map: map})
    let coordHandler = (pos) => {
      let ll = new mapboxgl.LngLat(pos.coords.longitude, pos.coords.latitude)
      map.setCenter(ll)
      map.setZoom(12)
      map.addControl(new mapboxgl.NavigationControl())
      map.on('click', (e) => {
        map.setCenter(e.lngLat)
        this.setState({coords: e.lngLat})
      })
    }
    window.navigator.geolocation.getCurrentPosition(coordHandler)
  }

  componentWillUnmount () {
    this.state.map.remove()
  }

  getNetworkStatus () {
    this.props.getNetworkStatus()
    this.getContractValues()
  }

  async getContractValues () {
    let currPrice = (await dt.currentPrice()).toNumber()
    let weiBal = (await dt.weiBal()).toNumber()
    this.setState({
      currPrice,
      weiBal
    })
  }

  async proposeProject (type, values) {
    // stakingPeriod in Days changed to seconds -> blockchain understands seconds
    // This is creating and storing an IPFS object
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
    await ipfs.object.put(obj, {enc: 'json'}, (err, node) => {
      if (err) {
        console.log('errrrr')
        throw err
      }
      multiHash = node.toJSON().multihash
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          await this.props.proposeProject(type, {cost: projObj.cost, stakingEndDate: projObj.stakingEndDate, multiHash: multiHash}, {from: accounts[0]})
        }
      })
    })
  }

  handlePhotoChange (info) {
    this.handlePhotoUpload(info.file.originFileObj)
    this.getBase64(info.file.originFileObj, imageUrl => this.setState({
      imageUrl,
      loading: false
    }))
    this.setState({loading: true})
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
    this.timer = setTimeout(this.triggerMapChange, WAIT_INTERVAL)
  }

  triggerMapChange () {
    const { location } = this.state
    client.geocodeForward(location, (err, data, res) => {
      if (err) { console.error(err) }
      this.state.map.setCenter(data.features[0].geometry.coordinates)
      this.state.map.setZoom(18)
      new mapboxgl.Marker()
        .setLngLat(data.features[0].geometry.coordinates)
        .addTo(this.state.map)
      this.setState({coords: data.features[0].geometry.coordinates})
    })
  }

  render () {
    return (
      <div>
        <Sidebar />
        <ProposeForm
          handlePhotoChange={this.handlePhotoChange}
          imageUrl={this.state.imageUrl}
          loading={this.state.loading}
          cost={typeof this.state.cost === 'undefined'
            ? 0
            : Math.ceil(this.state.cost / 20 / this.state.currPrice)}
          reputationCost={typeof this.state.cost === 'undefined'
            ? 0
            : Math.ceil(this.state.cost / this.state.weiBal * this.props.network.totalReputation / 20)}
          handlePriceChange={this.handlePriceChange}
          handleLocationChange={this.handleLocationChange}
          proposeProject={this.proposeProject}
          map={<div id='map' style={{width: 400, height: 400}} ref={el => { this.mapContainer = el }} />}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    network: state.network,
    user: state.user.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proposeProject: (type, projObj, txObj) => dispatch(proposeProject(type, projObj, txObj)),
    getNetworkStatus: () => dispatch(getNetworkStatus())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Propose)
