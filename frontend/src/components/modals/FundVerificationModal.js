import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import ButtonMintTokens from '../../contractComponents/stage0/MintTokens'
import { clearTransaction } from '../../actions/transactionActions'
import cancel from '../../images/tximages/cancel-1.svg'
import txpending from '../../images/tximages/txpending.svg'
import txconfirmed from '../../images/tximages/txconfirmed.svg'
import txfailed from '../../images/tximages/txfailed.svg'
import { web3 } from '../../utilities/blockchain'
import { font1 } from '../../styles/fonts'
import { grey1, affirmLight, cancelLight } from '../../styles/colors'

class VerificationModal extends React.Component {
  constructor () {
    super()
    this.state = {
      txState: 'verification'
    }
    // this.checkIfProjectPending = this.checkIfProjectPending.bind(this)
    // this.checkTxStatus = this.checkTxStatus.bind(this)
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

  render () {
    let topText, body, bottomText, backColor
    switch (this.props.tx.txStatus) {
      case null:
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
          <div>
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
            <div style={{ marginTop: 20, textAlign: 'center', color: grey1, alignSelf: 'center' }}>Note: This transaction like all blockchain transactions is non-reversible.</div>
          </div>
        backColor = 'white'
        break
      case 'pending':
        topText = <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: 'black', height: 75, width: '100%' }}>
          <img style={{ height: 30, width: 30, marginLeft: 20 }} src={cancel} alt={cancel} onClick={this.props.close} />
          <div style={{ fontFamily: 'Avenir Next', fontSize: 24, justifyContent: 'center' }}>
            Funding Transaction Pending
          </div>
          <div style={{ minHeight: 30, minWidth: 30 }} />
        </div>
        body = <div style={{ display: 'flex', flexDirection: 'row', height: 400 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 20, marginRight: 20, width: 360, textAlign: 'center' }}>
            <div style={{ margin: 40, fontFamily: font1, fontSize: 26 }}>You are funding the network with</div>
            <div style={{ fontFamily: font1, fontSize: 26 }}>
              <b>
                {`${web3.fromWei(this.props.ethToSend, 'ether')} Ether ~= $${web3.fromWei(this.props.ethToSend, 'ether') * this.props.ethPrice}`}
              </b>
            </div>
            <div style={{ marginTop: 40, marginRight: 40, marginLeft: 40, fontFamily: font1, fontSize: 26 }}>You will receive</div>
            <div style={{ fontFamily: font1, fontSize: 26 }}><b>{`${this.props.tokensToBuy} HYP`}</b></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: grey1, marginLeft: 20, marginRight: 20, width: 360, textAlign: 'center' }}>
            <div style={{ margin: 40, fontFamily: font1, fontSize: 20 }}>The Ethereum blockchain was conceived in 2014 by Vitalik Buterin</div>
            <div style={{ marginBottom: 40, marginLeft: 40, marginRight: 40, fontFamily: font1, fontSize: 20 }}>It has since become the world's most valuable programmable blockchain.</div>
            <img style={{ fontFamily: font1, fontSize: 20, justifyContent: 'center' }} src={txpending} alt={txpending} />

          </div>
        </div>
        bottomText = <div style={{ marginTop: 20, textAlign: 'center', color: grey1, alignSelf: 'center' }}>You can close this window and you will be updated on the status of the transaction.</div>
        break
      case 'success':
        topText = <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: 'black', height: 75, width: '100%' }}>
          <img style={{ height: 30, width: 30, marginLeft: 20 }} src={cancel} alt={cancel} onClick={this.props.close} />
          <div style={{ fontFamily: 'Avenir Next', fontSize: 24, justifyContent: 'center' }}>
            Funding Transaction Successul
          </div>
          <div style={{ minHeight: 30, minWidth: 30 }} />
        </div>
        body = <div style={{ display: 'flex', flexDirection: 'row', height: 400 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 20, marginRight: 20, width: 360, textAlign: 'center' }}>
            <div style={{ margin: 40, fontFamily: font1, fontSize: 26 }}>You funded the network with</div>
            <div style={{ fontFamily: font1, fontSize: 26 }}>
              <b>
                {`${web3.fromWei(this.props.ethToSend, 'ether')} Ether ~= $${web3.fromWei(this.props.ethToSend, 'ether') * this.props.ethPrice}`}
              </b>
            </div>
            <div style={{ marginTop: 40, marginRight: 40, marginLeft: 40, fontFamily: font1, fontSize: 26 }}>You received</div>
            <div style={{ fontFamily: font1, fontSize: 26 }}><b>{`${this.props.tokensToBuy} HYP`}</b></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: affirmLight, marginLeft: 20, marginRight: 20, width: 360, textAlign: 'center' }}>
            <div style={{ margin: 40, marginBottom: 30, fontFamily: font1, fontSize: 20 }}>Your transaction was confirmed!</div>
            {/* TODO: nsert transaction link */}
            <div style={{ marginBottom: 20, marginLeft: 40, marginRight: 40, fontFamily: font1, fontSize: 20 }}>You can view the receipt of your transaction here (insert link)</div>
            <div style={{ marginLeft: 40, marginRight: 40, fontFamily: font1, fontSize: 18 }}>Transaction Number:</div>
            <div style={{ marginBottom: 20, fontFamily: font1, fontSize: 20 }}>0</div>
            <img style={{ fontFamily: font1, fontSize: 20, justifyContent: 'center', height: 58, width: 58 }} src={txconfirmed} alt={txconfirmed} />
          </div>
        </div>
        bottomText = <div style={{ marginTop: 20, textAlign: 'center', color: grey1, alignSelf: 'center' }}>Note: This transaction like all blockchain transactions is non-reversible.</div>
        break
      case 'failure':
        topText = <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: 'black', height: 75, width: '100%' }}>
          <img style={{ height: 30, width: 30, marginLeft: 20 }} src={cancel} alt={cancel} onClick={this.props.close} />
          <div style={{ fontFamily: 'Avenir Next', fontSize: 24, justifyContent: 'center' }}>
            Funding Transaction Failed
          </div>
          <div style={{ minHeight: 30, minWidth: 30 }} />
        </div>
        body = <div style={{ display: 'flex', flexDirection: 'row', height: 400 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 20, marginRight: 20, width: 360, textAlign: 'center' }}>
            <div style={{ margin: 40, fontFamily: font1, fontSize: 26 }}>You unsuccessfully tried to fund the network with</div>
            <div style={{ fontFamily: font1, fontSize: 26 }}>
              <b>
                {`${web3.fromWei(this.props.ethToSend, 'ether')} Ether ~= $${web3.fromWei(this.props.ethToSend, 'ether') * this.props.ethPrice}`}
              </b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: cancelLight, marginLeft: 20, marginRight: 20, width: 360, textAlign: 'center' }}>
            <div style={{ margin: 40, fontFamily: font1, fontSize: 20 }}>Your transaction was unsuccesful</div>
            {/* TODO: nsert transaction link */}
            <div style={{ marginBottom: 40, marginLeft: 40, marginRight: 40, fontFamily: font1, fontSize: 20 }}>You can view the receipt of your transaction here (insert link)</div>
            <div style={{ marginBottom: 40, marginLeft: 40, marginRight: 40, fontFamily: font1, fontSize: 18 }}>Transaction Number:</div>
            <div style={{ marginBottom: 40, marginLeft: 40, marginRight: 40, fontFamily: font1, fontSize: 20 }}>0</div>
            <img style={{ fontFamily: font1, fontSize: 20, justifyContent: 'center', height: 58, width: 58 }} src={txfailed} alt={txfailed} />
          </div>
        </div>
        bottomText = <div style={{ marginTop: 20, textAlign: 'center', color: grey1, alignSelf: 'center' }}>Note: This transaction like all blockchain transactions is non-reversible.</div>
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
        visible={this.props.visible}
        footer={null}
        maskClosable={false}
        width={760}
        bodyStyle={{ height: 540, margin: 0, padding: 0 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {topText}
          {body}
          {bottomText}
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tx: state.tx
  }
}

export default connect(mapStateToProps)(VerificationModal)
