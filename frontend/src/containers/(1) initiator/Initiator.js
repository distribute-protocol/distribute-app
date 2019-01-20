/* global FileReader */

import React from 'react'
import { connect } from 'react-redux'
import price from 'crypto-price'
import Sidebar from '../../components/shared/Sidebar'
import ProposeLanding from '../../components/(1) initiator/landing'
import ProposeForm from '../../components/(1) initiator/form'
import InitiatorWelcome from '../../components/modals/InitiatorWelcome'
import InsufficientTokens from '../../components/modals/InsufficientTokens'
import InitiatorVerificationModal from '../../components/modals/InitiatorVerificationModal'
import ProjectPage from '../(2) finder/ProjectPage'
import ipfs from '../../utilities/ipfs'
import { getUserStatusWallet } from '../../actions/userActions'
import { getNetworkStatus } from '../../actions/networkActions'
import { clearTransaction } from '../../actions/transactionActions'
import { getProject } from '../../actions/projectActions'
import { eth, web3, dt, rr } from '../../utilities/blockchain'

class Initiator extends React.Component {
  constructor () {
    super()
    this.state = {
      firstTime: true,
      role: 'Initiator',
      firstModal: false,
      secondModal: false,
      tempProject: {},
      loading: false,
      imageUrl: false,
      verificationModal: false,
      collateralType: '',
      data: {
        cost: '',
        stakingEndDate: '',
        photo: '',
        name: '',
        location: [0, 0],
        summary: ''
      },
      proposalLanding: true,
      proposingProject: false
    }
    this.choosePropType = this.choosePropType.bind(this)
    this.chooseResource = this.chooseResource.bind(this)
    // this.redirect = this.redirect.bind(this)
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handlePhotoChange = this.handlePhotoChange.bind(this)
    this.storeData = this.storeData.bind(this)
    this.handleVerification = this.handleVerification.bind(this)
    this.handleVerifyCancel = this.handleVerifyCancel.bind(this)
  }

  componentWillMount () {
    this.props.getNetworkStatus()
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
      imageUrl: this.state.imageUrl,
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
      ipfs.add(buf, (err, result) => { // Upload buffer to IPFS
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

  async handlePriceChange (val) {
    let projectCost = val.target.value
    let ethPrice = (await price.getCryptoPrice('USD', 'ETH')).price
    let ethAmount = projectCost ? (projectCost / parseFloat(ethPrice)) : null
    if (ethAmount) {
      let cost = web3.toWei(ethAmount, 'ether')
      let tokensToStake = Math.ceil((cost * this.state.totalTokens) / (this.state.weiBal * 20))
      let repToStake = Math.ceil((cost * this.state.totalRep) / (this.state.weiBal * 20))
      this.setState({ tokensToStake, repToStake, cost, fiatCost: projectCost, ethPrice })
    }
  }

  choosePropType (propType) {
    this.setState({ firstModal: false, propType: propType })
    if (propType === 'tokens' && this.props.user.tokenBalance === 0) {
      this.setState({ secondModal: true })
    } else {
      this.setState({ proposingProject: true, proposalLanding: false })
    }
  }

  chooseResource () {
    this.setState({ firstModal: true })
  }

  async handleVerification (addr) {
    this.props.clearTransaction()
    await this.props.getProject(addr)
    this.setState({ verificationModal: false, projectProposed: true, proposingProject: false })
  }

  handleVerifyCancel () {
    this.setState({ verificationModal: false })
  }

  render () {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <InitiatorWelcome visible={this.state.firstTime && this.state.firstModal} continue={this.choosePropType} />
        <InsufficientTokens visible={this.state.firstTime && this.state.secondModal} continue={() => this.redirect('/fund')} />
        <InitiatorVerificationModal
          handleVerifyCancel={this.handleVerifyCancel}
          visible={this.state.verificationModal}
          close={this.handleVerification}
          collateralType={this.state.collateralType}
          data={this.state.data}
          fiatCost={this.state.fiatCost}
          ethPrice={this.state.ethPrice}
          tokensToStake={this.state.tokensToStake}
          repToStake={this.state.repToStake}
          finder={() => this.redirect('/finder')}
          networkStatus={this.props.network}
        />
        {this.state.proposalLanding
          ? <div>
            <Sidebar showIcons highlightIcon={this.state.role} history={this.props.history} />
            <ProposeLanding
              chooseResource={this.chooseResource}
            />
          </div>
          : null}
        {this.state.proposingProject
          ? <div>
            <Sidebar showIcons highlightIcon={this.state.role} redirect={this.redirect} />
            <ProposeForm
              tokensToStake={this.state.tokensToStake}
              repToStake={this.state.repToStake}
              handlePhotoChange={this.handlePhotoChange}
              imageUrl={this.state.imageUrl}
              handlePriceChange={this.handlePriceChange}
              storeData={this.storeData}
            />
          </div>
          : null}
        {this.state.projectProposed
          ? <div>
            <ProjectPage
              usdPerEth={this.state.usdPerEth}
              showIcons
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
    getNetworkStatus: () => dispatch(getNetworkStatus()),
    getProject: (projAddress) => dispatch(getProject(projAddress)),
    clearTransaction: () => dispatch(clearTransaction())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Initiator)
