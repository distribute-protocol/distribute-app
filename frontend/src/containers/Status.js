import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getEthPriceNow } from 'get-eth-price'
import Button from 'antd/lib/button'
import Sidebar from './Sidebar'
import {eth, web3, tr, rr, dt} from '../utilities/blockchain'
import * as _ from 'lodash'
const ButtonGroup = Button.Group
// import uport from '../utilities/uport'
// var mnid = require('mnid')

// let uportWR = uport.contract(JSON.parse(ReputationRegistryABI)).at(ReputationRegistryAddress)
class Status extends Component {
  constructor () {
    super()
    this.state = {
      value: 0,
      tokensToBuy: ''
    }
    this.buyShares = this.buyShares.bind(this)
    this.sellShares = this.sellShares.bind(this)
    this.getBalance = this.getBalance.bind(this)
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    window.tr = tr
    window.rr = rr
  }
  login () {
    // uport.requestCredentials({
    //   requested: ['name', 'avatar'],
    //   notifications: true
    // }).then((credentials) => {
    //   console.log(credentials)
    //   // console.log(mnid.decode(credentials.address))
    //   this.uportWR.register()
    //   // https://rinkeby.infura.io/11XiCuI1EjsowYvplZ24
    //   // const txobject = {
    //   //   to: '0xeec918d74c746167564401103096d45bbd494b74',
    //   //   function: WR.register(),
    //   //   appName: 'Nemo'
    //   // }
    //   // uport.sendTranaction(txobject).then(txID => console.log(txID))
    //   // WR.register()
    // })
  }
  componentWillMount () {
    if (_.isEmpty(this.props.user)) {
      // this.props.reroute()
    } else {

    }
    this.getBalance()
  }
    // let config = {
    //   method: 'GET',
    //   headers: new Headers(),
    //   mode: 'cors',
    //   cache: 'default'
    // }
    // fetch('/api', config).then((res, req) => {})
    // this.queryDatabaseTest()

  getBalance () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          // console.log(accounts[0])
          let ethPrice = await getEthPriceNow()
          ethPrice = ethPrice[Object.keys(ethPrice)].ETH.USD
          let balance,
            totalTokenSupply,
            weiBal,
            reputationBalance,
            totalReputationSupply,
            currentPrice,
            first
          // let balance = (await dt.balanceOf(accounts[0]))[0].toNumber()
          balance = (await dt.balanceOf(accounts[0])).toNumber()
          // console.log('balance', balance)
          totalTokenSupply = (await dt.totalSupply()).toNumber()
          // console.log('totalTokenSupply', totalTokenSupply)
          weiBal = (await dt.weiBal()).toNumber()
          // console.log('weiBal', weiBal)
          reputationBalance = (await rr.balances(accounts[0])).toNumber()
          // console.log('reputationBalance', reputationBalance)
          totalReputationSupply = (await rr.totalSupply()).toNumber()

          first = (await rr.first(accounts[0]))
          // console.log('totalReputationSupply', totalReputationSupply)

          currentPrice = (await dt.currentPrice()).toNumber()
          this.setState({
            totalTokenSupply,
            balance,
            ethPrice,
            weiBal,
            totalReputationSupply,
            reputationBalance,
            first,
            currentPrice: web3.fromWei(currentPrice, 'ether')
          })
        } else {
          console.error('Please Unlock MetaMask')
        }
      }
    })
  }

  async buyShares () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          await dt.mint(this.tokensToBuy.value, {value: web3.toWei(Math.ceil(this.state.ethToSend * 100000) / 100000, 'ether'), from: accounts[0]})
          .then(() => {
            this.getBalance()
            this.setState({
              tokensToBuy: ''
            })
          })
        }
      }
    })
  }

  sellShares () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          await dt.sell(this.tokensToBuy.value, {from: accounts[0]})
          .then(() => {
            this.getBalance()
            this.setState({
              tokensToBuy: ''
            })
          })
        }
      }
    })
  }

  register () {
    let accounts = eth.accounts
    rr.register({from: accounts[0]}, (err, result) => {
      if (!err) {
        console.log('yayyyyy')
      }
    })
  }

  faucet () {
    let accounts = eth.accounts
    rr.faucet({from: accounts[0]})
  }

  async onChange (val) {
    this.setState({tokensToBuy: val})
    if (val > 0) {
      try {
        let ethRequired, totalSupply, refund
        await dt.weiRequired(val).then(result => {
          // console.log(result)
          ethRequired = web3.fromWei(result.toNumber(), 'ether')
          // console.log('eth to send', ethRequired)
        })
        totalSupply = (await dt.totalSupply()).toNumber()
        if (totalSupply === 0) {
          refund = ethRequired
        } else {
          await dt.weiBal().then(result => {
            refund = web3.fromWei((result.toNumber() / totalSupply * val), 'ether')
          })
        }
        this.setState({ethToSend: ethRequired, ethToRefund: refund})
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  render () {
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, flexDirection: 'column', display: 'flex', justifyContent: 'space-between', alignItems: 'space-between'}}>
          <header className='App-header'>
            <h3 className='App-title2'>Network Status</h3>
          </header>
          {/* <Button onClick={this.login} style={{marginLeft: 20, backgroundColor: 'purple'}}>
            Connect with uPort
          </Button> */}
          <div style={{marginLeft: 20, marginTop: 40, display: 'flex', justifyContent: 'flex-start'}}>
            <div>
              <h3>Total Token Supply</h3>
              <h5>{this.state.totalTokenSupply}</h5>
              <h3>Your Token Balance</h3>
              <h5>{this.state.balance}</h5>
              <h3>Controlled Market Percentage</h3>
              <h5>{`${this.state.totalTokenSupply ? Math.round(this.state.balance / this.state.totalTokenSupply * 10000) / 100 : 0}`}%</h5>
              <h3>Eth Pool</h3>
              <h5>{web3.fromWei(this.state.weiBal, 'ether')} ETH</h5>
              <h3>Capital Equivalent</h3>
              <h5>{`$${this.state.ethPrice ? Math.round(this.state.ethPrice * web3.fromWei(this.state.weiBal, 'ether')) : 0}`}</h5>
              <h3>Current Token Price in Eth</h3>
              <h5>{this.state.currentPrice}</h5>
            </div>
            <div style={{marginLeft: 25}}>
              <h3>Total Reputation Supply</h3>
              <h5>{this.state.totalReputationSupply}</h5>
              <h3>Reputation Balance</h3>
              <h5>{this.state.reputationBalance}</h5>
            </div>
          </div>
          <Button style={{marginLeft: 20, marginTop: 10, width: 160, backgroundColor: '#115D8C', color: '#FFF'}} icon='reload' color='info' onClick={this.getBalance}>
            Refresh Balances
          </Button>
          <div style={{display: 'flex', flexDirection: 'row', marginTop: 30}}>
            <div style={{backgroundColor: '#C7D9D9', padding: 30, width: 250}}>
              {/* <Input getRef={(input) => (this.location = input)}  onChange={(e) => this.onChange('location', this.location.value)} value={location || ''} /> */}
              <div>
                <h3>Tokens:</h3>
                <input ref={(input) => (this.tokensToBuy = input)} placeholder='Number of Tokens' onChange={(e) => this.onChange(this.tokensToBuy.value)} value={this.state.tokensToBuy} type='number' />
              </div>
              <div style={{marginTop: 20}}>
                <h4>{`Cost to Buy: ${typeof this.state.ethToSend === 'undefined' ? 'n/a' : Math.round(this.state.ethToSend * 100000) / 100000} ETH`}</h4>
              </div>
              <div>
                <h4>{`Refund Amount: ${typeof this.state.ethToRefund === 'undefined' ? 'n/a' : Math.round(this.state.ethToRefund * 100000) / 100000} ETH`}</h4>
              </div>
              <div style={{marginTop: 20}}>
                <ButtonGroup>
                  <Button icon='plus-circle-o' color='primary' onClick={this.buyShares}>
                    Buy
                  </Button>
                  <Button icon='minus-circle-o' color='warning' onClick={this.sellShares}>
                    Sell
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <div style={{backgroundColor: '#F2A35E', padding: 30}}>
              {/* <Input getRef={(input) => (this.location = input)}  onChange={(e) => this.onChange('location', this.location.value)} value={location || ''} /> */}
              <div>
                <h3>Reputation:</h3>
              </div>
              <div style={{marginTop: 20}}>
                <ButtonGroup>
                  {this.state.reputationBalance === 0 && !this.state.first ? <Button color='success' icon='user-add' onClick={this.register}>
                    Register
                  </Button> : null}
                  {this.state.reputationBalance < 10000 ? <Button icon='download' color='success' onClick={this.faucet}>
                    Faucet
                  </Button> : null}
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
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
    reroute: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Status)
