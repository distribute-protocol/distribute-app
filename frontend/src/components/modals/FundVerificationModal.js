import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import ButtonMintTokens from '../../contractComponents/stage0/MintTokens'
import cancel from '../../images/tximages/cancel.svg'
import txpending from '../../images/tximages/txpending.svg'
import txconfirmed from '../../images/tximages/txconfirmed.svg'
import txfailed from '../../images/tximages/txfailed.svg'
import { web3 } from '../../utilities/blockchain'
import { font1 } from '../../styles/fonts'

class VerificationModal extends React.Component {
  constructor () {
    super()
    this.state = {
      txState: 'verification'
    }
    // this.checkIfProjectPending = this.checkIfProjectPending.bind(this)
    // this.checkTxStatus = this.checkTxStatus.bind(this)
    this.close = this.close.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return true
  }

  // checkIfProjectPending () {
  //   if (this.props.projects !== undefined && this.props.projects.projectProposed === true) {
  //     this.setState({txState: 'pending'})
  //     setTimeout(() => {
  //       this.checkTxStatus()
  //     }, 3000)
  //   } else if (this.state.txState === 'verification') {
  //     setTimeout(() => {
  //       this.checkIfProjectPending()
  //     }, 1000)
  //   }
  // }
  //
  // checkTxStatus () {
  //   if (this.props.projects.txHash !== undefined) {
  //     web3.eth.getTransactionReceipt(this.props.projects.txHash, (err, res) => {
  //       if (!err) {
  //         if (res.blockHash === null) {
  //           setTimeout(() => {
  //             this.checkTxStatus()
  //           }, 1000)
  //         } else {
  //           this.setState({projAddr: res.logs[0].address, txState: 'txConfirmed'})
  //         }
  //       }
  //     })
  //   }
  // }

  close () {
    // this.props.close(this.state.projAddr)
  }

  render () {
    let topText, body, bottomText, backColor
    switch (this.state.txState) {
      case 'verification':
        topText = <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'black', height: 75, width: '100%', borderBottom: '1px solid black' }}>
          <div style={{ fontFamily: 'Avenir Next', fontSize: 24, justifyContent: 'center' }}>
            Funding Transaction Details
          </div>
        </div>
        body = <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontFamily: font1, fontSize: 24 }}>You are funding the network with <b>{`${web3.fromWei(this.props.ethToSend, 'ether')}`}</b> Ether</div>
          <div style={{ fontFamily: font1, fontSize: 24, marginTop: 10 }}>You will receive <b>{`${this.props.tokensToBuy} HYP`}</b></div>
          <div style={{ marginTop: 40 }}>
            <p>Price Breakdown:</p>
            <p><b>Token Price:</b> {`${web3.fromWei(this.props.currentPrice, 'ether')}`}</p>
            <p><b>Minting Fee:</b> {`${web3.fromWei((this.props.ethToSend - this.props.currentPrice * this.props.tokensToBuy), 'ether')}`}</p>
          </div>
        </div>
        bottomText =
          <div style={{ display: 'flex', flexDirection: 'row', minWidth: '100%', justifyContent: 'space-evenly', marginTop: 90 }}>
            <Button ghost style={{ color: '#000000', borderColor: 'black', width: 200, height: 50, fontSize: 22, fontFamily: 'Avenir Next', textAlign: 'center' }} onClick={this.props.handleVerifyCancel}>
              Cancel
            </Button>
            <ButtonMintTokens
              wallet={this.props.wallet}
              ethToSend={this.props.ethToSend}
              tokensToBuy={this.props.tokensToBuy}
            />
          </div>
        backColor = 'white'
        break
      // case 'pending':
      //   topText = <div style={{ display: 'flex', justifyContent: 'space-around', color: 'black' }}><img style={{ cursor: 'pointer' }} src={cancel} alt={cancel} onClick={this.handleCancel} /><p style={{ marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center' }}>
      //     You are initiating a proposal with the following details:</p></div>
      //   bottomText = <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', color: 'black', paddingTop: 39 }}>
      //     <b><p style={{ textAlign: 'center', fontFamily: 'Lato', fontSize: 24 }}>Transaction Pending</p></b>
      //     <p style={{ justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 18, marginTop: -20 }}>The average rate that the ethereum blockchain adds blocks is 15 seconds.<br />Block time differs between chains with some blockchains such as bitcoin taking<br />10 minutes to add blocks.</p>
      //     <img style={{ justifyContent: 'center' }} src={txpending} alt={txpending} />
      //   </div>
      //   backColor = 'white'
      //   break
      // case 'txConfirmed':
      //   topText = <div style={{display: 'flex', justifyContent: 'space-between', color: 'black'}}><img style={{cursor: 'pointer'}} src={cancel} alt={cancel} onClick={this.handleCancel} /><p style={{marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500}}>Success!</p><p /></div>
      //   bottomText = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', color: 'black', paddingTop: 20}}>
      //     <b><p style={{textAlign: 'center', fontFamily: 'Lato', fontSize: 24}}>Transaction Successful</p></b>
      //     <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 18, marginTop: -20}}>Your proposal was successfully submitted. People can now find your project.</p>
      //     <img style={{justifyContent: 'center'}} src={txconfirmed} alt={txconfirmed} />
      //     <Button style={{marginTop: 10, borderRadius: 4, border: '1px solid rgba(0, 0, 0, 0.6)', color: 'rgba(0, 0, 0, 0.6)', maxWidth: 200, height: 45, fontSize: 24, fontFamily: 'Lato', textAlign: 'center'}} key='continuemoney' onClick={this.close}>
      //       Close
      //     </Button>
      //   </div>
      //   backColor = 'rgba(126, 211, 33, 0.25)'
      //   break
      // case 'txFailed':
      //   topText = <div style={{display: 'flex', justifyContent: 'space-between', color: 'black'}}><img style={{cursor: 'pointer', justifyContent: 'flex-start'}} src={cancel} alt={cancel} onClick={this.handleCancel} /><p style={{marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center'}}>Failed</p><p /></div>
      //   bottomText = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', color: 'black', paddingTop: 20}}>
      //     <b><p style={{textAlign: 'center', fontFamily: 'Lato', fontSize: 24}}>Transaction Failed</p></b>
      //     <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 18, marginTop: -20}}>Unfortunately your proposal was not submitted. Please try again.</p>
      //     <img style={{justifyContent: 'center'}} src={txfailed} alt={txfailed} />
      //     <Button style={{marginTop: 10, borderRadius: 4, border: '1px solid rgba(0, 0, 0, 0.6)', color: 'rgba(0, 0, 0, 0.6)', maxWidth: 200, height: 45, fontSize: 24, fontFamily: 'Lato', textAlign: 'center'}} key='continuemoney' onClick={this.handleCancel}>
      //       Close
      //     </Button>
      //   </div>
      //   backColor = 'rgba(126, 211, 33, 0.25)'
      //   break
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
        visible={this.props.visible}
        footer={null}
        maskClosable={false}
        width={760}
        bodyStyle={{ height: 540, backgroundColor: backColor, margin: 0, padding: 0 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {topText}
          {body}
            { /*
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 200, minWidth: '100%' }}>
            { this.props.data.name !== undefined ? <p style={{textAlign: 'center'}}>project name: {this.props.data.name}</p> : null }
            { this.props.data.summary !== undefined ? <p style={{textAlign: 'center'}}>project summary: {this.props.data.summary}</p> : null }
            { this.props.data.cost !== undefined ? <p style={{textAlign: 'center'}}>project cost: {this.props.data.cost}</p> : null }
            { this.props.data.photo !== undefined ? <p style={{textAlign: 'center'}}>project photo: {this.props.data.photo}</p> : null }
            { this.props.data.location !== undefined ? <p style={{textAlign: 'center'}}>project location: {this.props.data.location}</p> : null }
            { this.props.data.staking !== undefined ? <p style={{textAlign: 'center'}}>project end data: {this.props.data.stakingEndDate}</p> : null }
                    </div>
            */ }

          {bottomText}
        </div>
      </Modal>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     projects: state.projects
//   }
// }

export default connect()(VerificationModal)
