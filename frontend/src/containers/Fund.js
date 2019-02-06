import React from 'react'
import Sidebar from 'components/shared/Sidebar'
import { connect } from 'react-redux'
import { grey1, brandColor } from 'styles/colors'
import { font1 } from '../styles/fonts'
import { Button, Form, Input, Radio } from 'antd'
import FundVerificationModal from 'components/0_general/fund/modals/FundVerificationModal'
import price from 'crypto-price'
import { eth, web3, dt, rr } from 'utilities/blockchain'
import { getUserStatusWallet } from 'actions/userActions'
import { clearTransaction } from 'actions/transactionActions'

class Fund extends React.Component {
  constructor () {
    super()
    this.state = {
      balance: 0,
      price: 0,
      user: {},
      verificationModal: false,
      fundingType: 'ether'
    }
    this.onChange = this.onChange.bind(this)
    this.verifyChoice = this.verifyChoice.bind(this)
    this.handleVerifyCancel = this.handleVerifyCancel.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  componentWillMount () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          // this.props.getUserStatusWallet(accounts[0])
          let ethPrice = await price.getCryptoPrice('USD', 'ETH')
          // let totalTokens = await dt.totalSupply()
          // let totalRep = await rr.totalSupply()
          // let weiBal = await dt.weiBal()
          let weiBal = (await dt.weiBal()).toNumber()
          let currentPrice = web3.fromWei((await dt.currentPrice()).toNumber(), 'ether')

          await eth.getBalance(accounts[0], async (err, bal) => {
            if (!err) this.setState({ user: { wallet: accounts[0] }, weiBal, balance: web3.fromWei(bal.toNumber(), 'ether'), price: parseFloat(ethPrice.price), tokenPrice: currentPrice })
          })
        }
      }
    })
  }

  async onChange (val) {
    // if statement calculating dai or ethereum
    let value = val.target.value
    if (value > 0) {
      try {
        let totalSupply = (await dt.totalSupply()).toNumber()
        let currentPrice = (await dt.currentPrice())
        let ethToSend = this.state.fundingType === 'ether' ? web3.toWei(value, 'ether') : web3.toWei((value / this.state.price), 'ether')
        if (totalSupply === 0) {
          this.setState({ tokensToBuy: ethToSend / (50000000000000 * 2) - 10, ethToSend, currentPrice: 50000000000000, totalSupply, value })
        } else {
          let a = 1
          let b = (totalSupply * currentPrice - ethToSend) / (2 * currentPrice)
          let c = -(ethToSend * totalSupply) / (2 * currentPrice)
          let result1 = (-b + Math.sqrt(b * b - 4 * (a) * (c))) / 2 * a
          let result2 = (-b - Math.sqrt(b * b - 4 * (a) * (c))) / 2 * a
          this.setState({ tokensToBuy: result1 > result2 ? Math.floor(result1) - 1 : Math.floor(result2) - 1, ethToSend, currentPrice, totalSupply, value })
        }

        // let ethRequired, refund
        // await dt.weiRequired(val).then(result => {
        //   ethRequired = web3.fromWei(result.toNumber(), 'ether')
        // })
        // if (this.props.totalSupply === 0) {
        //   refund = ethRequired
        // } else {
        //   await dt.currentPrice().then(result => {
        //     refund = web3.fromWei((result.toNumber() * val), 'ether')
        //   })
        // }
        // this.setState({ethToSend: ethRequired, ethToRefund: refund})
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  verifyChoice () {
    this.setState({ verificationModal: true })
  }

  handleClose () {
    this.props.transactionClear()
    this.setState({ verificationModal: false })
  }

  handleVerifyCancel () {
    this.setState({ verificationModal: false })
  }

  onRadioChange (event) {
    this.setState({ fundingType: event.target.value })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <FundVerificationModal
          handleVerifyCancel={this.handleVerifyCancel}
          visible={this.state.verificationModal}
          close={this.handleClose}
          wallet={this.state.user.wallet}
          tokensToBuy={this.state.tokensToBuy}
          ethToSend={this.state.ethToSend}
          ethPrice={this.state.price}
          currentPrice={this.state.currentPrice}
          totalSupply={this.state.totalSupply}
        />
        <div>
          <Sidebar showIcons history={this.props.history} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 100, color: 'black' }}>
            <div style={{ backgroundColor: 'black', height: 55 }}>
              <h1 style={{ fontFamily: font1, color: 'white', fontSize: 24, height: 55, marginTop: 10, marginLeft: 20, fontWeight: 300 }}>Fund Network</h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70vw', alignSelf: 'center' }}>
              <div style={{ marginTop: 65, textAlign: 'center' }}>
                <div style={{ fontFamily: font1, fontSize: 24 }}>Funding the network requires ether, the cryptocurrency of the ethereum network, or Dai a stablecoin.</div>
                <div style={{ fontFamily: font1, fontSize: 24, marginTop: 20 }}>In order to begin the funding process you'll need to sign in using your metamast account</div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 80 }}>
                <div style={{ fontFamily: font1, fontSize: 24 }}>How much money would you like to fund the network with?</div>
                <Form layout='inline' style={{ marginTop: 20 }}>
                  <Form.Item>
                    {getFieldDecorator('cost')(<Input style={{ minWidth: 250, maxWidth: 350, borderRadius: 0, border: `1px solid ${grey1}` }} placeholder='Funding Amount' type='number' onChange={this.onChange} />)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('radio-group', { initialValue: 'ether' })(
                      <Radio.Group onChange={this.onRadioChange} size={'small'}>
                        <Radio value='ether'>Ether</Radio>
                        <Radio value='dai'>Dai ($)</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Form>
                <div style={{ fontFamily: font1, fontSize: 24, marginTop: 20 }}>
                  {`Maximum Amount Available: ~$${(this.state.balance * this.state.price).toFixed(2)} = ${(this.state.balance / 1).toFixed(2)} Ether`}
                </div>
                <div style={{ marginTop: 40, fontFamily: font1, fontSize: 36 }}>
                  You will receive <span style={{ fontSize: 48 }}>{`${this.state.tokensToBuy ? this.state.tokensToBuy : 0} HYP`}</span> Tokens
                </div>
                <Button style={{ marginTop: 20, backgroundColor: brandColor, color: 'white', height: 50, width: 235, fontSize: 24, fontWeight: 400 }} onClick={this.verifyChoice}>
                  {this.state.fundingType === 'ether' ? `Send ${web3.fromWei(this.state.ethToSend, 'ether')} Ether` : `Send ${this.state.value || 0} Dai`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transactionClear: () => dispatch(clearTransaction())
  }
}

export default connect(null, mapDispatchToProps)(Form.create()(Fund))
