import React from 'react'
import { connect } from 'react-redux'
import mapboxgl from 'mapbox-gl'
import moment from 'moment'
import { Button } from 'antd'
import ButtonProposeProject from '../../contractComponents/stage0/ProposeProject'
import ModalTemplate from './ModalTemplate.js'
import cancel from '../../images/tximages/cancel.svg'
import txpending from '../../images/tximages/txpending.svg'
import txconfirmed from '../../images/tximages/txconfirmed.svg'
import txfailed from '../../images/tximages/txfailed.svg'
import picture from '../../images/initiator/shape.png'
import { font1 } from '../../styles/fonts'
import { grey1, brandColor, affirmLight, cancelLight } from '../../styles/colors'
import { web3 } from '../../utilities/blockchain'

mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA'

class Map extends React.Component {
  constructor () {
    super()
    this.state = {}
  }
  componentDidMount () {
    const map = new mapboxgl.Map({
      container: this.mapContainer2,
      style: 'mapbox://styles/mapbox/streets-v10'
    })
    map.setCenter(this.props.location)
    map.setZoom(18)
    new mapboxgl.Marker()
      .setLngLat(this.props.location)
      .addTo(map)
    this.setState({ map })
  }
  componentWillUnmount () {
    this.state.map.remove()
  }
  render () {
    return (
      <div id='map' style={{ width: 375, height: 375, textAlign: 'left', overflow: 'hidden', position: 'relative' }} ref={el => { this.mapContainer2 = el }} />
    )
  }
}

class VerificationModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false,
      txState: 'verification',
      map: ''
    }
    this.checkIfProjectPending = this.checkIfProjectPending.bind(this)
    this.checkTxStatus = this.checkTxStatus.bind(this)
    this.close = this.close.bind(this)
  }

  checkIfProjectPending () {
    if (this.props.projects !== undefined && this.props.projects.projectProposed === true) {
      this.setState({ txState: 'pending' })
      setTimeout(() => {
        this.checkTxStatus()
      }, 3000)
    } else if (this.state.txState === 'verification') {
      setTimeout(() => {
        this.checkIfProjectPending()
      }, 1000)
    }
  }

  checkTxStatus () {
    if (this.props.projects.txHash !== undefined) {
      web3.eth.getTransactionReceipt(this.props.projects.txHash, (err, res) => {
        if (!err) {
          if (res.blockHash === null) {
            setTimeout(() => {
              this.checkTxStatus()
            }, 1000)
          } else {
            this.setState({ projAddr: res.logs[0].address, txState: 'txConfirmed' })
          }
        }
      })
    }
  }

  close () {
    this.props.close(this.state.projAddr)
    this.props.handleVerifyCancel()
  }

  render () {
    let title, headerLeft, leftSide, headerRight, rightSide
    switch (this.state.txState) {
      case 'verification':
        title = 'Project Proposal'
        headerLeft = 'Project Details'
        leftSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, maxHeight: 680, overflow: 'auto', border: `1px ${grey1} solid` }}>
          <div style={{ margin: 20, overflow: 'scroll', flexDirection: 'column', display: 'flex' }}>
            <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start' }}>
              Name: {this.props.data.name}
            </div>
            <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start' }}>
              Cost: ${this.props.fiatCost} ~ {web3.fromWei(this.props.data.cost, 'ether')} Eth
            </div>
            <img src={this.props.data.photo || this.props.data.imageUrl || picture} style={this.props.data.photo ? { width: 375, height: 335, marginBottom: 20 } : { width: 275, height: 235, alignSelf: 'center' }} />
            <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start' }}>
              Summary:
            </div>
            <div style={{ marginLeft: 20, marginRight: 20, alignSelf: 'flex-start' }}>
              {this.props.data.summary}
            </div>
            <div style={{ margin: 20, marginBottom: 0, marginLeft: 0, alignSelf: 'flex-start' }}>
              Location
            </div>
            <Map mapSetter={this.mapSetter} location={this.props.data.location} />
          </div>
        </div>
        headerRight = 'Transaction Details'
        rightSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, textAlign: 'center' }}>
          <div style={{ fontFamily: font1, fontSize: 25, marginTop: 20 }}>
            In order to initiate this proposal you are required to contribute:
          </div>
          <div style={{ fontFamily: font1, fontWeight: 400, fontSize: 40, margin: 40 }}>
            {this.props.collateralType === 'tokens' ? `${this.props.tokensToStake} Tokens` : `${this.props.repToStake} Clout`}
          </div>
          <div style={{ fontFamily: font1, fontWeight: 400, fontSize: 22, color: grey1 }}>
            This is calculated based on the project cost of ${this.props.fiatCost}, which represents {(this.props.data.cost / parseInt(this.props.networkStatus.weiBal) * 100).toFixed(2)}% of the network.
          </div>
          <div style={{ fontFamily: font1, fontSize: 26, marginTop: 40 }}>
            This proposal will expire {moment(this.props.data.stakingEndDate * 1000).fromNow()}.
          </div>
          <div style={{ fontFamily: font1, fontWeight: 400, fontSize: 18, color: grey1, marginTop: 40, marginLeft: 40, marginRight: 40 }}>
            If your proposal is not fully funded you will lose your the value you used to create the project. However, if you project is funded you will be rewarded with 1% of the projects cost.
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', minWidth: '100%', justifyContent: 'space-evenly', marginTop: 40 }}>
            <Button ghost style={{ color: '#000000', borderColor: 'black', width: 180, height: 50, fontSize: 22, fontFamily: 'Avenir Next', textAlign: 'center' }} onClick={this.props.handleVerifyCancel}>
              Cancel
            </Button>
            <ButtonProposeProject
              collateralType={this.props.collateralType}
              data={this.props.data}
              style={{
                color: 'white',
                backgroundColor: brandColor,
                width: 180,
                height: 50,
                fontSize: 26,
                fontFamily: font1,
                textAlign: 'center',
                borderColor: brandColor
              }}
              checkPending={this.checkIfProjectPending}
            />
          </div>
        </div>
        break
      case 'pending':
        // topText = <div style={{
        //   display: 'flex',
        //   justifyContent: 'space-around',
        //   color: 'black'
        // }}>
        //   <img style={{ cursor: 'pointer' }} src={cancel} alt={cancel} onClick={this.props.handleVerifyCancel} />
        //   <p style={{ marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center' }}>
        //     You are initiating a proposal with the following details:
        //   </p>
        // </div>
        // bottomText = <div style={{
        //   display: 'flex',
        //   flexDirection: 'column',
        //   justifyContent: 'space-evenly',
        //   alignItems: 'center',
        //   color: 'black',
        //   paddingTop: 39
        // }}>
        //   <b>
        //     <p style={{
        //       textAlign: 'center',
        //       fontFamily: 'Lato',
        //       fontSize: 24
        //     }}>
        //       Transaction Pending
        //     </p>
        //   </b>
        //   <p style={{
        //     justifyContent: 'center',
        //     textAlign: 'center',
        //     fontFamily: 'Lato',
        //     fontSize: 18,
        //     marginTop: -20
        //   }}>
        //     The average rate that the ethereum blockchain adds blocks is 15 seconds.<br />
        //     Block time differs between chains with some blockchains such as bitcoin taking<br />
        //     10 minutes to add blocks.
        //   </p>
        //   <img style={{ justifyContent: 'center' }} src={txpending} alt={txpending} />
        // </div>
        break
      case 'txConfirmed':
        // topText = <div style={{
        //   display: 'flex',
        //   justifyContent: 'space-between',
        //   color: 'black'
        // }}>
        //   <img style={{ cursor: 'pointer' }} src={cancel} alt={cancel} onClick={this.props.handleVerifyCancel} />
        //   <p style={{ marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500 }}>Success!</p>
        // </div>
        // bottomText = <div style={{
        //   display: 'flex',
        //   flexDirection: 'column',
        //   justifyContent: 'space-evenly',
        //   alignItems: 'center',
        //   color: 'black',
        //   paddingTop: 20
        // }}>
        //   <b><p style={{
        //     textAlign: 'center',
        //     fontFamily: 'Lato',
        //     fontSize: 24
        //   }}>Transaction Successful</p></b>
        //   <p style={{ justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 18, marginTop: -20 }}>
        //     Your proposal was successfully submitted. People can now find your project.
        //   </p>
        //   <img style={{ justifyContent: 'center' }} src={txconfirmed} alt={txconfirmed} />
        //   <Button style={{
        //     marginTop: 10,
        //     borderRadius: 4,
        //     border: '1px solid rgba(0, 0, 0, 0.6)',
        //     color: 'rgba(0, 0, 0, 0.6)',
        //     maxWidth: 200,
        //     height: 45,
        //     fontSize: 24,
        //     fontFamily: 'Lato',
        //     textAlign: 'center'
        //   }} key='continuemoney' onClick={this.close}>
        //     Close
        //   </Button>
        // </div>
        break
      case 'txFailed':
        // topText = <div style={{
        //   display: 'flex',
        //   justifyContent: 'space-between',
        //   color: 'black'
        // }}>
        //   <img style={{
        //     cursor: 'pointer',
        //     justifyContent: 'flex-start'
        //   }} src={cancel} alt={cancel} onClick={this.props.handleVerifyCancel} />
        //   <p style={{
        //     marginTop: 15,
        //     fontFamily: 'Avenir Next',
        //     fontSize: 30,
        //     fontWeight: 500,
        //     justifyContent: 'center'
        //   }}>Failed</p>
        // </div>
        // bottomText = <div style={{
        //   display: 'flex',
        //   flexDirection: 'column',
        //   justifyContent: 'space-evenly',
        //   alignItems: 'center',
        //   color: 'black',
        //   paddingTop: 20
        // }}>
        //   <b><p style={{
        //     textAlign: 'center',
        //     fontFamily: 'Lato',
        //     fontSize: 24
        //   }}>Transaction Failed</p></b>
        //   <p style={{
        //     justifyContent: 'center',
        //     textAlign: 'center',
        //     fontFamily: 'Lato',
        //     fontSize: 18,
        //     marginTop: -20
        //   }}>
        //     Unfortunately your proposal was not submitted. Please try again.
        //   </p>
        //   <img style={{ justifyContent: 'center' }} src={txfailed} alt={txfailed} />
        //   <Button style={{
        //     marginTop: 10,
        //     borderRadius: 4,
        //     border: '1px solid rgba(0, 0, 0, 0.6)',
        //     color: 'rgba(0, 0, 0, 0.6)',
        //     maxWidth: 200,
        //     height: 45,
        //     fontSize: 24,
        //     fontFamily: 'Lato',
        //     textAlign: 'center'
        //   }} key='continuemoney' onClick={this.props.handleVerifyCancel}>
        //     Close
        //   </Button>
        // </div>
        break
      default:
        title = null
        headerLeft = null
        headerRight = null
        leftSide = null
        rightSide = null
        break
    }
    return (
      <ModalTemplate visible={this.props.visible} title={title} headerLeft={headerLeft} headerRight={headerRight} rightSide={rightSide} leftSide={leftSide} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects,
    network: state.network
  }
}

export default connect(mapStateToProps)(VerificationModal)
