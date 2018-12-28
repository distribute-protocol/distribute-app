/* global FileReader */

import React from 'react'
import { connect } from 'react-redux'
import price from 'crypto-price'
import ProposeForm from '../components/propose/form'
import ProposeLanding from '../components/propose/landing'
import Sidebar from '../components/shared/Sidebar'
import InitiatorWelcome from '../components/modals/InitiatorWelcome'
import InsufficientTokens from '../components/modals/InsufficientTokens'
import VerificationModal from '../components/modals/VerificationModal'
import ProjectPage from './finder/ProjectPage'
import ipfs from '../utilities/ipfs'
import { getUserStatusWallet } from '../actions/userActions'
import { getProject } from '../actions/projectActions'
import { eth, web3, dt, rr } from '../utilities/blockchain'

class Initiator extends React.Component {
  constructor () {
    super()
    this.state = {
      firstTime: true,
      role: 'Initiator',
      showSidebarIcons: true,
      firstModal: false,
      secondModal: false,
      tempProject: {},
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
      proposalLanding: true,
      proposingProject: false
    }
    this.choosePropType = this.choosePropType.bind(this)
    this.chooseResource = this.chooseResource.bind(this)
    this.redirect = this.redirect.bind(this)
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handlePhotoChange = this.handlePhotoChange.bind(this)
    this.storeData = this.storeData.bind(this)
    this.handleVerification = this.handleVerification.bind(this)
  }

  componentWillMount () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.getUserStatusWallet(accounts[0])
          let usdPerEth = await price.getCryptoPrice('USD', 'ETH')
          let totalTokens = await dt.totalSupply()
          let totalRep = await rr.totalSupply()
          let weiBal = await dt.weiBal()
          this.setState({ usdPerEth, totalTokens, totalRep, weiBal })
        }
      }
    })
    this.timer = null
  }

  storeData (type, values, category, coords) {
    // stakingPeriod in Days changed to seconds -> blockchain understands seconds
    // This is creating and storing an IPFS object
    let projObj = {
      cost: this.state.cost,
      stakingEndDate: Math.floor(values.date.valueOf() / 1000),
      photo: this.state.photo,
      name: values.name,
      location: coords,
      summary: values.summary,
      category: category,
      collateralType: type
    }
    this.setState({ data: projObj, verificationModal: true, collateralType: type })
  }

  handlePhotoChange (info) {
    this.handlePhotoUpload(info.file.originFileObj)
    this.getBase64(info.file.originFileObj, imageUrl => this.setState({
      imageUrl,
      loading: false
    }))
    this.setState({ loading: true })
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
        this.setState({ photo: url, loading: false })
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
    if (web3.toWei(val.target.value, 'ether') !== 'undefined') {
      let cost = web3.toWei(val.target.value, 'ether')
      let tokensToStake = Math.ceil((cost * this.state.totalTokens) / (this.state.weiBal * 20))
      let repToStake = Math.ceil((cost * this.state.totalRep) / (this.state.weiBal * 20))
      this.setState({ tokensToStake, repToStake, cost })
    }
  }

  choosePropType (propType) {
    this.setState({ firstModal: false, propType: propType })
    if (propType === 'tokens' && this.props.user.userTokens === 0) {
      this.setState({ secondModal: true })
    } else {
      this.setState({ proposingProject: true, proposalLanding: false })
    }
  }

  chooseResource () {
    console.log('hello')
    this.setState({ firstModal: true })
  }

  redirect (url) {
    this.props.history.push(url)
  }

  areYouSure () {
    this.setState({ verificationModal: true })
  }

  async handleVerification (addr) {
    await this.props.getProject(addr)
    this.setState({ projectProposed: true, proposingProject: false })
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
            tokensToStake={this.state.tokensToStake}
            repToStake={this.state.repToStake}
            finder={() => this.redirect('/finder')} />
          : null }
        {this.state.proposalLanding
          ? <div>
            <Sidebar showIcons={this.state.showSidebarIcons} highlightIcon={this.state.role} redirect={this.redirect} />
            <ProposeLanding
              chooseResource={this.chooseResource}
            />
          </div>
          : null}
        {this.state.proposingProject
          ? <div>
            <Sidebar showIcons={this.state.showSidebarIcons} highlightIcon={this.state.role} redirect={this.redirect} />
            <ProposeForm
              tokensToStake={this.state.tokensToStake}
              repToStake={this.state.repToStake}
              handlePhotoChange={this.handlePhotoChange}
              imageUrl={this.state.imageUrl}
              handlePriceChange={this.handlePriceChange}
              handleLocationChange={this.handleLocationChange}
              storeData={this.storeData}
            />
          </div>
          : null}

        {this.state.projectProposed
          ? <div>
            <ProjectPage
              usdPerEth={this.state.usdPerEth}
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
    getUserStatusWallet: (userAccount) => dispatch(getUserStatusWallet(userAccount)),
    getProject: (projAddress) => dispatch(getProject(projAddress))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Initiator)
