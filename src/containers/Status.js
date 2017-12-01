// import React from 'react'
//
// class Status extends React.Component {
//   render () {
//     return (
//       <div style={{backgroundColor: 'blue', marginLeft: 200, width: 400, height: 600}} />
//     )
//   }
// }
//
// export default Status

import React, { Component } from 'react'
import { TokenHolderRegistryABI, TokenHolderRegistryAddress, TokenHolderRegistryBytecode } from '../abi/TokenHolderRegistry'
import { WorkerRegistryABI, WorkerRegistryAddress, WorkerRegistryBytecode } from '../abi/WorkerRegistry'
import { getEthPriceNow } from 'get-eth-price'
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
    window.thr = this.thr
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
      let weiBal = Eth.fromWei((await this.thr.weiBal())[0], 'ether')
      this.setState({totalTokenSupply, balance, ethPrice, weiBal})
    } catch (error) {
      throw new Error(error)
    }
  }
  buyShares () {
    let thr = this.thr
    eth.accounts().then(accountsArr => {
      thr.mint(7000, {value: Eth.toWei(20, 'ether'), from: accountsArr[0]})
      this.getBalance()
    })
  }
  sellShares () {
    let thr = this.thr
    eth.accounts().then(accountsArr => {
      thr.burnAndRefund(7000, {from: accountsArr[0]})
      this.getBalance()
    })
  }
  render () {
    window.price = this.state.price
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          {/* <img src={logoclassName='App-logo' alt='logo' /> */}
          <h1 className='App-title'>distribute</h1>
        </header>
        <div onClick={this.login} style={{width: 90, height: 30, padding: 20, margin: 10, backgroundColor: 'purple'}}>
          Connect with uPort
        </div>
        <div style={{marginLeft: 20}}>
          <h3>Total Token Supply</h3>
          <h4>{this.state.totalTokenSupply}</h4>
          <h3>Token Balance</h3>
          <h4>{this.state.balance}</h4>
          <h3>Controlled Market Percentage</h3>
          <h4>{Math.round(this.state.balance / this.state.totalTokenSupply * 10000) / 100}</h4>
          <h3>Eth Pool</h3>
          <h4>{this.state.weiBal}</h4>
          <h3>Capital Equivalent</h3>
          <h4>{`$${this.state.ethPrice ? Math.round(this.state.ethPrice * this.state.weiBal) * 100 / 100 : 0}`}</h4>
        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{backgroundColor: 'blue', color: 'white', width: 60, height: 40, margin: 10}} onClick={this.buyShares}>
            <h3 style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>Buy</h3>
          </div>
          <div style={{backgroundColor: 'red', color: 'white', width: 60, height: 40, margin: 10, justifyContent: 'center', alignItems: 'center'}} onClick={this.sellShares}>
            <h3 style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>Sell</h3>
          </div>
          <div style={{backgroundColor: 'teal', color: 'black'}} onClick={this.getBalance}>
            <p>{`Refresh Balances`}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Status
