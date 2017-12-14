import React, { Component } from 'react'
import { getEthPriceNow } from 'get-eth-price'
import { Button } from 'reactstrap'
// import logo from './logo.svg'
// import './App.css'
import Eth from 'ethjs'
import {eth, tr, rr, dt} from '../utilities/blockchain'

import uport from '../utilities/uport'
var mnid = require('mnid')

// let uportWR = uport.contract(JSON.parse(ReputationRegistryABI)).at(ReputationRegistryAddress)
// window.uportWR = uportWR
window.Eth = Eth
class Status extends Component {
  constructor () {
    super()
    this.state = {
      value: 0
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
    // let config = {
    //   method: 'GET',
    //   headers: new Headers(),
    //   mode: 'cors',
    //   cache: 'default'
    // }
    // fetch('/api', config).then((res, req) => {})
    this.queryDatabaseTest()
    this.getBalance()
  }
  queryDatabaseTest () {
    let config = {
      method: 'GET',
      headers: new Headers(),
      mode: 'cors',
      cache: 'default'
    }
    fetch(`/api/databasetest`, config)
    .then(response => response.json())
    .then(text => console.log(text))
    // .then((resArr) => {
    //   // this.setState({databaseTest: response})
    //   console.log('query', resArr)
    // })
  }

  postDatabaseTest (value) {
    let config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    fetch(`/api/databasetest?value=${value}`, config)
    .then((val) => {
      console.log('post response', val)
    })
  }
  async getBalance () {
    try {
      let accounts = await eth.accounts()
      let balance = (await dt.balanceOf(accounts[0]))[0].toNumber()
      let ethPrice = await getEthPriceNow()
      ethPrice = ethPrice[Object.keys(ethPrice)].ETH.USD
      let totalTokenSupply = (await dt.totalSupply())[0].toNumber()
      let totalFreeTokenSupply = (await dt.totalFreeSupply())[0].toNumber()
      let weiBal = Eth.fromWei((await dt.weiBal())[0], 'ether')

      let reputationBalance = (await rr.balances(accounts[0]))[0].toNumber()
      let totalReputationSupply = (await rr.totalSupply())[0].toNumber()
      let totalFreeReputationSupply = (await rr.totalFreeSupply())[0].toNumber()
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
    eth.accounts().then(accountsArr => {
      dt.mint(this.tokensToBuy.value || 700, {value: Eth.toWei(30, 'ether'), from: accountsArr[0]})
      this.getBalance()
    })
  }
  sellShares () {
    eth.accounts().then(accountsArr => {
      dt.burnAndRefund(this.tokensToBuy.value, {from: accountsArr[0]})
      this.getBalance()
    })
  }

  async register () {
    let accounts = await eth.accounts()
    rr.register({from: accounts[0]})
  }

  async onChange (val) {
    if (val > 0) {
      try {
        let targetPrice = (await dt.targetPrice(val))[0].toNumber()
        console.log('target price' + targetPrice)
        let ethRequired = Eth.fromWei((await dt.weiRequired(targetPrice, val))[0], 'ether')
        console.log('wei required' + ethRequired)
        window.weiRequired = ethRequired
        console.log(ethRequired)
        let totalSupply = (await dt.totalSupply.call())[0].toNumber()
        let refund
        totalSupply === 0
          ? refund = ethRequired
          : refund = Eth.fromWei((parseInt((await dt.weiBal.call())[0].toString()) / totalSupply * val), 'ether')
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

          <div style={{marginLeft: 25}}>
            <h3>Database Test</h3>
            <h5>{JSON.stringify(this.state.databaseTest)}</h5>
            <div style={{marginTop: 20}}>
              <Button color='primary' onClick={() => this.postDatabaseTest(5)}>
                DatabaseTest
              </Button>
            </div>
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
