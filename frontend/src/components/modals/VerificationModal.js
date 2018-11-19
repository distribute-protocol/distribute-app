import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import ButtonProposeProject from '../../contractComponents/stage0/ProposeProject'
import cancel from '../../images/tximages/cancel.svg'
import txpending from '../../images/tximages/txpending.svg'
import txconfirmed from '../../images/tximages/txconfirmed.svg'
import txfailed from '../../images/tximages/txfailed.svg'
import { web3 } from '../../utilities/blockchain'

class VerificationModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false,
      txState: 'verification'
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.checkIfProjectPending = this.checkIfProjectPending.bind(this)
    this.checkTxStatus = this.checkTxStatus.bind(this)
    this.close = this.close.bind(this)
  }

  componentWillMount () {
    this.setState({modalVisible: this.props.visible})
  }

  handleCancel () {
    this.setState({modalVisible: false})
  }

  checkIfProjectPending () {
    if (this.props.projects !== undefined && this.props.projects.projectProposed === true) {
      this.setState({txState: 'pending'})
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
            this.setState({projAddr: res.logs[0].address, txState: 'txConfirmed'})
          }
        }
      })
    }
  }

  close () {
    this.props.close(this.state.projAddr)
    this.handleCancel()
  }

  render () {
    let topText, bottomText, backColor
    switch (this.state.txState) {
      case 'verification':
        topText = <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black'}}><p style={{fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center'}}>You are initiating a proposal with the following details:</p></div>
        bottomText = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 39}}>
          <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Avenir Next', fontSize: 25}}>In order to initiate this proposal you are required to<br />contribute:</p>
          <b><p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 40, marginTop: -20}}>XX,XXX Clout</p></b>
          <div style={{display: 'flex', minWidth: '100%', justifyContent: 'space-evenly', marginTop: -20}}>
            <Button style={{borderRadius: 4, color: '#989898', backgroundColor: 'white', maxWidth: 200, height: 55, fontSize: 30, fontFamily: 'Lato', textAlign: 'center'}} key='continueclout' onClick={this.handleCancel}>
              <b>Cancel</b>
            </Button>
            <ButtonProposeProject
              collateralType={this.props.collateralType}
              data={this.props.data}
              style={{borderRadius: 4, color: 'white', backgroundColor: '#A4D573', maxWidth: 200, height: 55, fontSize: 30, fontFamily: 'Lato', textAlign: 'center'}}
              checkPending={this.checkIfProjectPending}
            />
          </div>
        </div>
        backColor = 'white'
        break
      case 'pending':
        topText = <div style={{display: 'flex', justifyContent: 'space-around', color: 'black'}}><img style={{cursor: 'pointer'}} src={cancel} alt={cancel} onClick={this.handleCancel} /><p style={{marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center'}}>You are initiating a proposal with the following details:</p></div>
        bottomText = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', color: 'black', paddingTop: 39}}>
          <b><p style={{textAlign: 'center', fontFamily: 'Lato', fontSize: 24}}>Transaction Pending</p></b>
          <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 18, marginTop: -20}}>The average rate that the ethereum blockchain adds blocks is 15 seconds.<br />Block time differs between chains with some blockchains such as bitcoin taking<br />10 minutes to add blocks.</p>
          <img style={{justifyContent: 'center'}} src={txpending} alt={txpending} />
        </div>
        backColor = 'white'
        break
      case 'txConfirmed':
        topText = <div style={{display: 'flex', justifyContent: 'space-between', color: 'black'}}><img style={{cursor: 'pointer'}} src={cancel} alt={cancel} onClick={this.handleCancel} /><p style={{marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500}}>Success!</p><p /></div>
        bottomText = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', color: 'black', paddingTop: 20}}>
          <b><p style={{textAlign: 'center', fontFamily: 'Lato', fontSize: 24}}>Transaction Successful</p></b>
          <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 18, marginTop: -20}}>Your proposal was successfully submitted. People can now find your project.</p>
          <img style={{justifyContent: 'center'}} src={txconfirmed} alt={txconfirmed} />
          <Button style={{marginTop: 10, borderRadius: 4, border: '1px solid rgba(0, 0, 0, 0.6)', color: 'rgba(0, 0, 0, 0.6)', maxWidth: 200, height: 45, fontSize: 24, fontFamily: 'Lato', textAlign: 'center'}} key='continuemoney' onClick={this.close}>
            Close
          </Button>
        </div>
        backColor = 'rgba(126, 211, 33, 0.25)'
        break
      case 'txFailed':
        topText = <div style={{display: 'flex', justifyContent: 'space-between', color: 'black'}}><img style={{cursor: 'pointer', justifyContent: 'flex-start'}} src={cancel} alt={cancel} onClick={this.handleCancel} /><p style={{marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center'}}>Failed</p><p /></div>
        bottomText = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', color: 'black', paddingTop: 20}}>
          <b><p style={{textAlign: 'center', fontFamily: 'Lato', fontSize: 24}}>Transaction Failed</p></b>
          <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 18, marginTop: -20}}>Unfortunately your proposal was not submitted. Please try again.</p>
          <img style={{justifyContent: 'center'}} src={txfailed} alt={txfailed} />
          <Button style={{marginTop: 10, borderRadius: 4, border: '1px solid rgba(0, 0, 0, 0.6)', color: 'rgba(0, 0, 0, 0.6)', maxWidth: 200, height: 45, fontSize: 24, fontFamily: 'Lato', textAlign: 'center'}} key='continuemoney' onClick={this.handleCancel}>
            Close
          </Button>
        </div>
        backColor = 'rgba(126, 211, 33, 0.25)'
        break
      default:
        topText = null
        bottomText = null
        backColor = 'white'
        break
    }
    return (
      <Modal
        centered
        closable={false}
        visible={this.state.modalVisible}
        footer={null}
        maskClosable={false}
        width={929}
        bodyStyle={{height: 600, backgroundColor: backColor}}
      >
        {topText}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 200, minWidth: '100%', border: '1px solid black', marginLeft: 0, marginRight: 0}}>
          { /*
          { this.props.data.name !== undefined ? <p style={{textAlign: 'center'}}>project name: {this.props.data.name}</p> : null }
          { this.props.data.summary !== undefined ? <p style={{textAlign: 'center'}}>project summary: {this.props.data.summary}</p> : null }
          { this.props.data.cost !== undefined ? <p style={{textAlign: 'center'}}>project cost: {this.props.data.cost}</p> : null }
          { this.props.data.photo !== undefined ? <p style={{textAlign: 'center'}}>project photo: {this.props.data.photo}</p> : null }
          { this.props.data.location !== undefined ? <p style={{textAlign: 'center'}}>project location: {this.props.data.location}</p> : null }
          { this.props.data.staking !== undefined ? <p style={{textAlign: 'center'}}>project end data: {this.props.data.stakingEndDate}</p> : null }
          */ }
        </div>
        {bottomText}
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

export default connect(mapStateToProps)(VerificationModal)
