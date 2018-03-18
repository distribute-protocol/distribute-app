import React, { Component } from 'react'
import { connect } from 'react-redux'
import { proposeProject } from '../actions/projectActions'
import ProposePage from '../components/Propose'
import Sidebar from '../components/shared/Sidebar'
import { push } from 'react-router-redux'
import {eth, web3, tr, rr, dt} from '../utilities/blockchain'
import * as _ from 'lodash'
import moment from 'moment'
import ipfsAPI from 'ipfs-api'
let ipfs = ipfsAPI()
window.moment = moment

class Propose extends Component {
  constructor () {
    super()
    this.state = {
      tempProject: {},
      currPrice: 0,
      loading: false
    }
    this.proposeProject = this.proposeProject.bind(this)
    this.getContractValues = this.getContractValues.bind(this)
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount () {
    if (_.isEmpty(this.props.user)) {
      // this.props.reroute()
    }
    this.getContractValues()
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
    // stakingPeriod in Days changed to milliseconds
    let projObj = {
      cost: this.state.cost,
      stakingEndDate: values.date.valueOf(),
      photo: this.state.photo,
      name: values.name,
      location: values.location,
      summary: values.summary
    }
    const obj = {
      Data: JSON.stringify(projObj),
      Links: []
    }
    let multiHash
    let receiptHandler = (tx) => {
      let txReceipt = tx.receipt
      let projectAddress = '0x' + txReceipt.logs[0].topics[1].slice(txReceipt.logs[0].topics[1].length - 40, (txReceipt.logs[0].topics[1].length))
      this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress, ipfsHash: `https://ipfs.io/ipfs/${multiHash}`}))
      this.setState({cost: 0, photo: false})
    }

    await ipfs.object.put(obj, {enc: 'json'}, (err, node) => {
      if (err) {
        throw err
      }
      multiHash = node.toJSON().multihash
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          if (type === 'tokens') {
            await tr.proposeProject(projObj.cost, projObj.stakingEndDate, web3.fromAscii(multiHash), {from: accounts[0]}).then(tx => receiptHandler(tx))
          } else if (type === 'reputation') {
            await rr.proposeProject(projObj.cost, projObj.stakingEndDate, web3.fromAscii(multiHash), {from: accounts[0]}).then(tx => receiptHandler(tx))
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
        console.log(`Url --> ${url}`)
        // let tempProject = Object.assign({}, this.state.tempProject, {photo: url})
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

  render () {
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
          proposeProject={this.proposeProject}
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
