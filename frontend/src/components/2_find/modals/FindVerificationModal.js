import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Button, Input, Modal } from 'antd'
import { clearTransaction } from 'actions/transactionActions'
import ButtonProposeProject from 'contractComponents/stage0/ProposeProject'
import StakeProject from 'contractComponents/stage1/StakeProject'
import UnstakeProject from 'contractComponents/stage1/UnstakeProject'
import Map from '../../shared/ModalMap'
import ModalTemplate from 'components/shared/modals/ModalTemplate.js'
// import cancel from '../../images/tximages/cancel.svg'
import txpending from 'images/tximages/txpending.svg'
import txconfirmed from 'images/tximages/txconfirmed.svg'
import txfailed from 'images/tximages/txfailed.svg'
import picture from 'images/initiator/shape.png'
import { grey1, brandColor, affirmLight, cancelLight } from 'styles/colors'
import { web3 } from 'utilities/blockchain'
import styles from 'styles'
let { colors, fonts, typography, container } = styles

class VerificationModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false,
      txState: 'verification',
      map: '',
      val: 0
    }
    this.close = this.close.bind(this)
    this.updateValue = this.updateValue.bind(this)
  }

  close () {
    this.props.close()
    this.props.clearTx()
  }

  updateValue (val) {
    this.setState({ val: val.target.value })
  }

  render () {
    let rightSide
    let ethCost = web3.fromWei(this.props.data.weiCost, 'ether')
    let headerLeft = 'Project Details'
    let headerRight = 'Transaction Details'
    let leftSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, maxHeight: 680, overflow: 'auto', border: `1px ${grey1} solid` }}>
      <div style={{ margin: 20, overflow: 'scroll', flexDirection: 'column', display: 'flex' }}>
        <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start', fontFamily: fonts.font1, fontSize: 20 }}>
          Name: {this.props.data.name}
        </div>
        <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start', fontFamily: fonts.font1, fontSize: 20 }}>
          Cost: ${parseFloat(ethCost * this.props.ethPrice).toFixed(2)} ~ {parseFloat(ethCost).toFixed(2)} Eth
        </div>
        <img src={this.props.data.photo || this.props.data.imageUrl || picture} style={this.props.data.photo ? { width: 375, height: 335, marginBottom: 20 } : { width: 275, height: 235, alignSelf: 'center' }} />
        <div style={{ margin: 20, marginLeft: 0, alignSelf: 'flex-start', fontFamily: fonts.font1, fontSize: 20 }}>
          Summary:
        </div>
        <div style={{ marginLeft: 20, marginRight: 20, alignSelf: 'flex-start', fontFamily: fonts.font1, fontSize: 20 }}>
          {this.props.data.summary}
        </div>
        <div style={{ margin: 20, marginBottom: 0, marginLeft: 0, alignSelf: 'flex-start', fontFamily: fonts.font1, fontSize: 20 }}>
          Location
        </div>
        <Map mapSetter={this.mapSetter} location={this.props.data.location} />
      </div>
    </div>
    switch (this.props.tx.txStatus) {
      case null:
        rightSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, textAlign: 'center' }}>
          <div style={{ fontFamily: fonts.font1, fontSize: 25, marginTop: 20 }}>
            How much would you like to contribute to this project?
          </div>
          <Input onChange={this.updateValue} type='numeric' style={{ width: 200, borderColor: 'black' }} placeholder={1000} />
          <div style={{ fontFamily: fonts.font1, fontWeight: 400, fontSize: 40, margin: 40 }}>
            {this.props.type === 'tokens' ? 'Tokens' : 'Clout'}
          </div>
          <div>
            You are funding this project with {this.props.type === 'tokens' ? 'tokens' : 'clout'}. Your total {this.props.type === 'tokens' ? 'tokens' : 'clout'} balance is {this.props.type === 'tokens' ? this.props.user.tokenBalance : this.props.user.reputationBalance }.
          </div>
          <div style={{ fontFamily: fonts.font1, fontSize: 20, margin: 20 }}>
            The proposal will expire in: <b>{moment(this.props.data.nextDeadline * 1000).fromNow()}</b>
          </div>
          <div>
           If the proposal is not fully funded you will receive whatever stake you added to the project. However, if the project is funded, your stake will be locked until project completion or failure.
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', minWidth: '100%', justifyContent: 'space-evenly', marginTop: 40 }}>
            <Button ghost style={{ color: '#000000', borderColor: 'black', width: 180, height: 50, fontSize: 22, fontFamily: 'Avenir Next', textAlign: 'center' }} onClick={this.props.closeModal}>
              Cancel
            </Button>
            { this.props.action === 'stake'
              ? <StakeProject type={this.props.type} address={this.props.data.address} user={this.props.user.wallets[0]} val={this.state.val} />
              : <UnstakeProject type={this.props.type} address={this.props.data.address} user={this.props.user.wallets[0]} val={this.state.val} />
            }
          </div>
        </div>
        break
      case 'pending':
        rightSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, textAlign: 'center' }}>
          <div style={{ fontFamily: fonts.font1, fontSize: 24, fontWeight: 400, marginTop: 20 }}>
            Transaction Pending
          </div>
          <div style={{ fontFamily: fonts.font1, fontSize: 20, margin: 20 }}>
            The average rate that the ethereum blockchain adds blocks is 15 seconds.
            Block time differs between chains with some blockchains such as bitcoin taking
            10 minutes to add blocks..
          </div>
          <img style={{ justifyContent: 'center', marginTop: 30 }} src={txpending} alt={txpending} />
          <div style={{ fontFamily: fonts.font1, fontSize: 20, margin: 20 }}>
            Your Cost: <b>{this.props.collateralType === 'tokens' ? `${this.props.tokensToStake} Tokens` : `${this.props.repToStake} Clout`}</b>
          </div>
          <div style={{ fontFamily: fonts.font1, fontSize: 20, margin: 20 }}>
            Proposal Expiration: <b>{moment(this.props.data.stakingEndDate * 1000).fromNow()}</b>
          </div>
        </div>

        break
      case 'success':
        rightSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, textAlign: 'center', backgroundColor: affirmLight, height: 680 }}>
          <div style={{ fontFamily: fonts.font1, fontSize: 24, fontWeight: 400, marginTop: 40 }}>
            Transaction Successul
          </div>
          <div style={{ fontFamily: fonts.font1, fontSize: 20, margin: 20 }}>
            Your proposal was successfully submitted. People can now find your project. You can share it with the following link.
          </div>
          <img style={{ justifyContent: 'center', marginTop: 40 }} src={txconfirmed} alt={txconfirmed} />
          <div style={{ fontFamily: fonts.font1, fontSize: 14, margin: 20, marginBottom: 0 }}>
            Transaction ID:
          </div>
          <div style={{ fontFamily: fonts.font1, fontSize: 16, margin: 20, marginTop: 0 }}>
            (Insert Transaction ID)
          </div>
          <Button style={{
            marginTop: 20,
            border: '1px solid black',
            color: 'black',
            maxWidth: 180,
            height: 50,
            fontSize: 24,
            fontFamily: fonts.font1,
            textAlign: 'center'
          }} key='continuemoney' onClick={this.props.closeModal}>
            Close
          </Button>
        </div>
        break
      case 'failure':
        rightSide = <div style={{ flexDirection: 'column', alignItems: 'center', margin: 20, textAlign: 'center', height: 680, backgroundColor: cancelLight }}>
          <div style={{ fontFamily: fonts.font1, fontSize: 24, fontWeight: 400, marginTop: 40 }}>
            Transaction Failed
          </div>
          <div style={{ fontFamily: fonts.font1, fontSize: 20, margin: 20 }}>
            Your proposal was not successfully submitted. Please try again.
          </div>
          <img style={{ justifyContent: 'center', marginTop: 60 }} src={txfailed} alt={txfailed} />
          <div style={{ fontFamily: fonts.font1, fontSize: 14, margin: 20, marginBottom: 0 }}>
            Transaction ID:
          </div>
          <div style={{ fontFamily: fonts.font1, fontSize: 16, margin: 20, marginTop: 0 }}>
            (Insert Transaction ID)
          </div>
          <Button style={{
            marginTop: 20,
            border: '1px solid black',
            color: 'black',
            maxWidth: 180,
            height: 50,
            fontSize: 24,
            fontFamily: fonts.font1,
            textAlign: 'center'
          }} key='continuemoney' onClick={this.props.closeModal}>
            Close
          </Button>
        </div>
        break
      default:
        rightSide = null
        break
    }

    return (
      <Modal
        centered
        closable={false}
        visible={this.props.visible}
        footer={null}
        maskClosable={false}
        width={'64.58%'}
        bodyStyle={{ height: '40%', maxHeight: '60%', backgroundColor: 'white', padding: 0, overflow: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 65, color: 'black', backgroundColor: this.props.action === 'stake' ? colors.color1 : colors.color2 }}>
          <div style={{ fontFamily: fonts.font1, fontSize: 30, textAlign: 'center', color: colors.white }}>{this.props.action === 'stake' ? 'Project Funding' : 'Project Refund'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', color: 'black', marginTop: 20 }}>
          <div style={{ width: '50%', flexDirection: 'column', alignItems: 'center', textAlign: 'center', overflow: 'auto' }}>
            <div style={{ fontFamily: fonts.font1, fontSize: 24 }}>
              {headerLeft}
            </div>
            {leftSide}
          </div>
          <div style={{ flexDirection: 'column', alignItems: 'center', width: '50%', textAlign: 'center' }}>
            <div style={{ fontFamily: fonts.font1, fontSize: 24 }}>
              {headerRight}
            </div>
            {rightSide}
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    network: state.network,
    tx: state.tx
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearTx: () => dispatch(clearTransaction())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(VerificationModal)
// <ButtonProposeProject
//   collateralType={this.props.collateralType}
//   data={this.props.data}
//   style={{
//     color: 'white',
//     backgroundColor: brandColor,
//     width: 180,
//     height: 50,
//     fontSize: 26,
//     fontFamily: fonts.font1,
//     textAlign: 'center',
//     borderColor: brandColor
//   }}
// />
