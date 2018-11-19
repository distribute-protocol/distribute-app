/* global FileReader */

import React from 'react'
import { connect } from 'react-redux'
import mapboxgl from 'mapbox-gl'
import MapboxClient from 'mapbox/lib/services/geocoding'
import ProposeForm from '../components/Propose'
import Sidebar from '../components/shared/Sidebar'
import InitiatorWelcome from '../components/modals/InitiatorWelcome'
import InsufficientTokens from '../components/modals/InsufficientTokens'
import VerificationModal from '../components/modals/VerificationModal'
import ProjectPage from './shared/ProjectPage'
import ipfs from '../utilities/ipfs'
import { getUserStatus } from '../actions/userActions'
import { getProject } from '../actions/projectActions'
import { eth, web3 } from '../utilities/blockchain'

const client = new MapboxClient('pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA')
mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA'
const WAIT_INTERVAL = 1500

class Initiator extends React.Component {
  constructor () {
    super()
    this.state = {
      firstTime: true,
      role: 'Initiator',
      showSidebarIcons: true,
      firstModal: true,
      secondModal: false,
      tempProject: {},
      currPrice: 0,
      loading: false,
      imageUrl: false,
      location: [0, 0],
      verificationModal: false,
      collateralType: '',
      data: {
        cost: '',
        stakingEndDate: '',
        photo: '',
        name: '',
        location: '',
        summary: ''
      },
      proposingProject: true
    }
    this.choosePropType = this.choosePropType.bind(this)
    this.redirect = this.redirect.bind(this)
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.handlePhotoChange = this.handlePhotoChange.bind(this)
    this.triggerMapChange = this.triggerMapChange.bind(this)
    this.storeData = this.storeData.bind(this)
    this.handleVerification = this.handleVerification.bind(this)
  }

  componentWillMount () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.getUserStatus(accounts[0])
        }
      }
    })
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

  // getNetworkStatus () {
  //   this.props.getNetworkStatus()
  //   this.getContractValues()
  // }
  //
  // async getContractValues () {
  //   let currPrice = (await dt.currentPrice()).toNumber()
  //   let weiBal = (await dt.weiBal()).toNumber()
  //   this.setState({
  //     currPrice,
  //     weiBal
  //   })
  // }

  storeData (type, values, category) {
    // stakingPeriod in Days changed to seconds -> blockchain understands seconds
    // This is creating and storing an IPFS object
    let projObj = {
      cost: this.state.cost,
      stakingEndDate: Math.floor(values.date.valueOf() / 1000),
      photo: this.state.photo,
      name: values.name,
      location: this.state.coords,
      summary: values.summary,
      category: category,
      collateralType: type
    }
    this.setState({data: projObj, verificationModal: true, collateralType: type})
  }

  // async proposeProject () {
  //   const obj = {
  //     Data: JSON.stringify(this.state.data),
  //     Links: []
  //   }
  //   let multiHash
  //   await ipfs.object.put(obj, {enc: 'json'}, (err, node) => {
  //     if (err) {
  //       throw err
  //     }
  //     multiHash = node.toJSON().multihash
  //     eth.getAccounts(async (err, accounts) => {
  //       if (!err) {
  //         await this.props.proposeProject(this.state.collateralType, {cost: this.state.data.cost, stakingEndDate: this.state.data.stakingEndDate, multiHash: multiHash}, {from: accounts[0]})
  //       }
  //     })
  //   })
  // }

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
    try {
      this.setState({cost: web3.toWei(val.target.value, 'ether')})
    } catch (e) {
      console.log(e)
    }
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

  choosePropType (propType) {
    this.setState({firstModal: false, propType: propType})
    if (propType === 'tokens' && this.props.user.userTokens === 0) {
      this.setState({secondModal: true})
    }
  }

  redirect (url) {
    this.props.history.push(url)
  }

  areYouSure () {
    this.setState({verificationModal: true})
  }

  async handleVerification (addr) {
    await this.props.getProject(addr)
    this.setState({projAddr: addr, projectPage: true, proposingProject: false})
  }

  render () {
    return (
      <div>
        {this.state.firstTime && this.state.firstModal
          ? <InitiatorWelcome visible={this.state.firstTime && this.state.firstModal} continue={this.choosePropType} />
          : null }
        {this.state.firstTime && this.state.secondModal
          ? <InsufficientTokens visible={this.state.firstTime && this.state.secondModal} continue={() => this.redirect('/dashboard')} />
          : null }
        {this.state.verificationModal
          ? <VerificationModal
            visible={this.state.verificationModal}
            close={(addr) => this.handleVerification(addr)}
            collateralType={this.state.collateralType}
            data={this.state.data}
            finder={() => this.redirect('/finder')} />
          : null }
        {this.state.proposingProject
          ? <div>
            <Sidebar showIcons={this.state.showSidebarIcons} highlightIcon={this.state.role} redirect={this.redirect} />
            <ProposeForm
              handlePhotoChange={this.handlePhotoChange}
              imageUrl={this.state.imageUrl}
              handlePriceChange={this.handlePriceChange}
              handleLocationChange={this.handleLocationChange}
              storeData={this.storeData}
              map={<div id='map' style={{width: 400, height: 400}} ref={el => { this.mapContainer = el }} />}
            />
          </div>
          : null}
        {this.state.projectPage
          ? <div>
            <ProjectPage
              showIcons={this.state.showSidebarIcons}
              highlightIcon={this.state.role}
              redirect={this.redirect}
              project={this.props.projects} />
          </div>
          : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    network: state.network,
    projects: state.projects,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserStatus: (userAccount) => dispatch(getUserStatus(userAccount)),
    getProject: (projAddress) => dispatch(getProject(projAddress))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Initiator)
