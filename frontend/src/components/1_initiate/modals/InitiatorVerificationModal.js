import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Button } from 'antd'
import ButtonProposeProject from 'contractComponents/stage0/ProposeProject'
import Map from '../../shared/ModalMap'
import ModalTemplate from 'components/shared/modals/ModalTemplate.js'
// import cancel from '../../images/tximages/cancel.svg'
import txpending from 'images/tximages/txpending.svg'
import txconfirmed from 'images/tximages/txconfirmed.svg'
import txfailed from 'images/tximages/txfailed.svg'
import picture from 'images/initiator/shape.png'
import { font1 } from 'styles/fonts'
import { grey1, brandColor, affirmLight, cancelLight } from 'styles/colors'
import { web3 } from 'utilities/blockchain'

class VerificationModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false,
      txState: 'verification',
      map: ''
    }
    this.close = this.close.bind(this)
  }

  close () {
    this.props.close()
  }

  render () {
    let rightSide
    let ethCost = web3.fromWei(this.props.data.cost, 'ether')
    let title = 'Project Proposal'
    let headerLeft = 'Project Details'
    let headerRight = 'Transaction Details'
    let leftSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, maxHeight: 680, overflow: 'auto', border: `1px ${grey1} solid` }}>
      <div style={{ margin: 20, overflow: 'scroll', flexDirection: 'column', display: 'flex' }}>
        <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start', fontFamily: font1, fontSize: 20 }}>
          Name: {this.props.data.name}
        </div>
        <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start', fontFamily: font1, fontSize: 20 }}>
          Cost: ${this.props.fiatCost} ~ {parseFloat(ethCost).toFixed(2)} Eth
        </div>
        <img src={this.props.data.photo || this.props.data.imageUrl || picture} style={this.props.data.photo ? { width: 375, height: 335, marginBottom: 20 } : { width: 275, height: 235, alignSelf: 'center' }} />
        <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start', fontFamily: font1, fontSize: 20 }}>
          Summary:
        </div>
        <div style={{ marginLeft: 20, marginRight: 20, alignSelf: 'flex-start', fontFamily: font1, fontSize: 20 }}>
          {this.props.data.summary}
        </div>
        <div style={{ margin: 20, marginBottom: 0, marginLeft: 0, alignSelf: 'flex-start', fontFamily: font1, fontSize: 20 }}>
          Location
        </div>
        <Map mapSetter={this.mapSetter} location={this.props.data.location} />
      </div>
    </div>
    switch (this.props.tx.txStatus) {
      case null:
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
            />
          </div>
        </div>
        break
      case 'pending':
        rightSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, textAlign: 'center' }}>
          <div style={{ fontFamily: font1, fontSize: 24, fontWeight: 400, marginTop: 20 }}>
            Transaction Pending
          </div>
          <div style={{ fontFamily: font1, fontSize: 20, margin: 20 }}>
            The average rate that the ethereum blockchain adds blocks is 15 seconds.
            Block time differs between chains with some blockchains such as bitcoin taking
            10 minutes to add blocks..
          </div>
          <img style={{ justifyContent: 'center', marginTop: 30 }} src={txpending} alt={txpending} />
          <div style={{ fontFamily: font1, fontSize: 20, margin: 20 }}>
            Your Cost: <b>{this.props.collateralType === 'tokens' ? `${this.props.tokensToStake} Tokens` : `${this.props.repToStake} Clout`}</b>
          </div>
          <div style={{ fontFamily: font1, fontSize: 20, margin: 20 }}>
            Proposal Expiration: <b>{moment(this.props.data.stakingEndDate * 1000).fromNow()}</b>
          </div>
        </div>

        break
      case 'success':
        rightSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, textAlign: 'center', backgroundColor: affirmLight, height: 680 }}>
          <div style={{ fontFamily: font1, fontSize: 24, fontWeight: 400, marginTop: 40 }}>
            Transaction Successul
          </div>
          <div style={{ fontFamily: font1, fontSize: 20, margin: 20 }}>
            Your proposal was successfully submitted. People can now find your project. You can share it with the following link.
          </div>
          <img style={{ justifyContent: 'center', marginTop: 40 }} src={txconfirmed} alt={txconfirmed} />
          <div style={{ fontFamily: font1, fontSize: 14, margin: 20, marginBottom: 0 }}>
            Transaction ID:
          </div>
          <div style={{ fontFamily: font1, fontSize: 16, margin: 20, marginTop: 0 }}>
            (Insert Transaction ID)
          </div>
          <Button style={{
            marginTop: 20,
            border: '1px solid black',
            color: 'black',
            maxWidth: 180,
            height: 50,
            fontSize: 24,
            fontFamily: font1,
            textAlign: 'center'
          }} key='continuemoney' onClick={this.close}>
            Close
          </Button>
        </div>
        break
      case 'failure':
        rightSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, textAlign: 'center', height: 680, backgroundColor: cancelLight }}>
          <div style={{ fontFamily: font1, fontSize: 24, fontWeight: 400, marginTop: 40 }}>
            Transaction Failed
          </div>
          <div style={{ fontFamily: font1, fontSize: 20, margin: 20 }}>
            Your proposal was not successfully submitted. Please try again.
          </div>
          <img style={{ justifyContent: 'center', marginTop: 60 }} src={txfailed} alt={txfailed} />
          <div style={{ fontFamily: font1, fontSize: 14, margin: 20, marginBottom: 0 }}>
            Transaction ID:
          </div>
          <div style={{ fontFamily: font1, fontSize: 16, margin: 20, marginTop: 0 }}>
            (Insert Transaction ID)
          </div>
          <Button style={{
            marginTop: 20,
            border: '1px solid black',
            color: 'black',
            maxWidth: 180,
            height: 50,
            fontSize: 24,
            fontFamily: font1,
            textAlign: 'center'
          }} key='continuemoney' onClick={this.close}>
            Close
          </Button>
        </div>
        break
      default:
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
    network: state.network,
    tx: state.tx
  }
}

export default connect(mapStateToProps)(VerificationModal)
