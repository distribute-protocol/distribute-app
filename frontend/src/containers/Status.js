import React, { Component } from 'react'
import { TokenHolderRegistryABI, TokenHolderRegistryAddress, TokenHolderRegistryBytecode } from '../abi/TokenHolderRegistry'
import { WorkerRegistryABI, WorkerRegistryAddress, WorkerRegistryBytecode } from '../abi/WorkerRegistry'
import { getEthPriceNow } from 'get-eth-price'
import { Button } from 'reactstrap'
// import logo from './logo.svg'
// import './App.css'
import Eth from 'ethjs'

import uport from '../utilities/uport'
var mnid = require('mnid')
const eth = new Eth(window.web3.currentProvider)

let uportWR = uport.contract(JSON.parse(WorkerRegistryABI)).at(WorkerRegistryAddress)
window.uportWR = uportWR
window.Eth = Eth
class Status extends Component {
  constructor () {
    super()
    this.state = {
      value: 0
    }
    this.THR = eth.contract(JSON.parse(TokenHolderRegistryABI), TokenHolderRegistryBytecode)
    this.WR = eth.contract(JSON.parse(WorkerRegistryABI), WorkerRegistryBytecode)
    this.thr = this.THR.at(TokenHolderRegistryAddress)
    this.wr = this.WR.at(WorkerRegistryAddress)
    this.uportWR = uport.contract(JSON.parse(WorkerRegistryABI)).at(WorkerRegistryAddress)
    this.buyShares = this.buyShares.bind(this)
    this.sellShares = this.sellShares.bind(this)
    this.getBalance = this.getBalance.bind(this)
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    window.thr = this.thr
    window.wr = this.wr
  }
  login () {
    uport.requestCredentials({
      requested: ['name', 'avatar'],
      notifications: true
    }).then((credentials) => {
      console.log(credentials)
      console.log(mnid.decode(credentials.address))
      this.uportWR.register()
      // https://rinkeby.infura.io/11XiCuI1EjsowYvplZ24
      // const txobject = {
      //   to: '0xeec918d74c746167564401103096d45bbd494b74',
      //   function: WR.register(),
      //   appName: 'Nemo'
      // }
      // uport.sendTranaction(txobject).then(txID => console.log(txID))
      // WR.register()
    })
  }
  componentWillMount () {
    this.getBalance()
  }

  async getBalance () {
    try {
      let accounts = await eth.accounts()
      let balance = (await this.thr.balanceOf(accounts[0]))[0].toNumber()
      let ethPrice = await getEthPriceNow()
      ethPrice = ethPrice[Object.keys(ethPrice)].ETH.USD
      let totalTokenSupply = (await this.thr.totalCapitalTokenSupply())[0].toNumber()
      let totalFreeTokenSupply = (await this.thr.totalFreeCapitalTokenSupply())[0].toNumber()
      let weiBal = Eth.fromWei((await this.thr.weiBal())[0], 'ether')

      let reputationBalance = (await this.wr.balances(accounts[0]))[0].toNumber()
      let totalReputationSupply = (await this.wr.totalWorkerTokenSupply())[0].toNumber()
      let totalFreeReputationSupply = (await this.wr.totalFreeWorkerTokenSupply())[0].toNumber()
      this.setState({
        totalTokenSupply,
        balance,
        ethPrice,
        weiBal,
        totalFreeTokenSupply,
        totalReputationSupply,
        totalFreeReputationSupply,
        reputationBalance
      })
    } catch (error) {
      throw new Error(error)
    }
  }
  buyShares () {
    let thr = this.thr
    eth.accounts().then(accountsArr => {
      thr.mint(this.tokensToBuy.value || 700, {value: Eth.toWei(30, 'ether'), from: accountsArr[0]})
      this.getBalance()
    })
  }
  sellShares () {
    let thr = this.thr
    eth.accounts().then(accountsArr => {
      thr.burnAndRefund(this.tokensToBuy.value, {from: accountsArr[0]})
      this.getBalance()
    })
  }

  async register () {
    let wr = this.wr
    let accounts = await eth.accounts()
    wr.register({from: accounts[0]})
  }

  async onChange (val) {
    if (val > 0) {
      try {
        let targetPrice = (await this.thr.targetPrice(val))[0].toNumber()
        console.log('target price' + targetPrice)
        let ethRequired = Eth.fromWei((await this.thr.weiRequired(targetPrice, val))[0], 'ether')
        console.log('wei required' + ethRequired)
        window.weiRequired = ethRequired
        console.log(ethRequired)
        let totalCapitalTokenSupply = (await this.thr.totalCapitalTokenSupply.call())[0].toNumber()
        let refund
        totalCapitalTokenSupply === 0
          ? refund = ethRequired
          : refund = Eth.fromWei((parseInt((await this.thr.weiBal.call())[0].toString()) / totalCapitalTokenSupply * val), 'ether')
        this.setState({ethToSend: ethRequired, ethToRefund: refund})
      } catch (error) {
        throw new Error(error)
      }
    }
  }
  render () {
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          {/* <img src={logoclassName='App-logo' alt='logo' /> */}
          <h1 className='App-title'>distribute</h1>
        </header>
        <Button onClick={this.login} style={{marginLeft: 20, backgroundColor: 'purple'}}>
          Connect with uPort
        </Button>
        <div style={{marginLeft: 20, marginTop: 40, display: 'flex', justifyContent: 'flex-start'}}>
          <div>
            <h3>Total Token Supply</h3>
            <h5>{this.state.totalTokenSupply}</h5>
            <h3>Total Free Token Supply</h3>
            <h5>{this.state.totalFreeTokenSupply}</h5>
            <h3>Your Token Balance</h3>
            <h5>{this.state.balance}</h5>
            <h3>Controlled Market Percentage</h3>
            <h5>{Math.round(this.state.balance / this.state.totalTokenSupply * 10000) / 100}%</h5>
            <h3>Eth Pool</h3>
            <h5>{this.state.weiBal} ETH</h5>
            <h3>Capital Equivalent</h3>
            <h5>{`$${this.state.ethPrice ? Math.round(this.state.ethPrice * this.state.weiBal) * 100 / 100 : 0}`}</h5>
          </div>
          <div style={{marginLeft: 25}}>
            <h3>Total Reputation Supply</h3>
            <h5>{this.state.totalReputationSupply}</h5>
            <h3>Total Free Reputation Supply</h3>
            <h5>{this.state.totalFreeReputationSupply}</h5>
            <h3>Reputation Balance</h3>
            <h5>{this.state.reputationBalance}</h5>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div>
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
              <Button color='primary' onClick={this.buyShares}>
                Buy
              </Button>
              <Button color='warning' onClick={this.sellShares} style={{marginLeft: 10}}>
                Sell
              </Button>
              <Button color='info' onClick={this.getBalance} style={{marginLeft: 10}}>
                Refresh Balances
              </Button>
              {this.state.reputationBalance < 1 ? <Button color='success' onClick={this.register} style={{marginLeft: 10}}>
                Register
              </Button> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Status
