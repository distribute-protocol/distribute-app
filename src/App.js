import React, { Component } from 'react'
import { TokenHolderRegistryABI, TokenHolderRegistryAddress, TokenHolderRegistryBytecode } from './abi/TokenHolderRegistry'
import { WorkerRegistryABI, WorkerRegistryAddress, WorkerRegistryBytecode } from './abi/WorkerRegistry'
import logo from './logo.svg'
import './App.css'
import Eth from 'ethjs'
import uport from './util/uport'
var mnid = require('mnid')
const eth = new Eth(window.web3.currentProvider)

let uportWR = uport.contract(JSON.parse(WorkerRegistryABI)).at(WorkerRegistryAddress)
window.uportWR = uportWR

class App extends Component {
  constructor () {
    super()
    this.state = {}
    this.THR = eth.contract(JSON.parse(TokenHolderRegistryABI), TokenHolderRegistryBytecode)
    this.WR = eth.contract(JSON.parse(WorkerRegistryABI), WorkerRegistryBytecode)
    this.thr = this.THR.at(TokenHolderRegistryAddress)
    this.wr = this.WR.at(WorkerRegistryAddress)
    this.uportWR = uport.contract(JSON.parse(WorkerRegistryABI)).at(WorkerRegistryAddress)
    this.buyShares = this.buyShares.bind(this)
    this.sellShares = this.sellShares.bind(this)
    this.getBalance = this.getBalance.bind(this)
    this.login = this.login.bind(this)
  }
  login () {
    uport.requestCredentials({
      requested: ['name', 'avatar'],
      notifications: true
    }).then((credentials) => {
      console.log(credentials)
      console.log(mnid.decode(credentials.address))
      this.uportWR.register()
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
  getBalance () {
    eth.accounts().then(accountsArr => {
      this.thr.balanceOf(accountsArr[0]).then((balance) => {
        this.setState({balance: balance[0]['words'][0]})
      })
    })
  }
  buyShares () {
    let thr = this.thr
    eth.accounts().then(accountsArr => {
      thr.mint(700, {value: Eth.toWei(20, 'ether'), from: accountsArr[0]})
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
    return (
      <div className='App'>
        <header className='App-header'>
          {/* <img src={logo} className='App-logo' alt='logo' /> */}
          <h1 className='App-title'>distribute</h1>
        </header>
        <div onClick={this.login} style={{width: 90, height: 30, padding: 20, margin: 10, backgroundColor: 'purple'}}>
          Connect with uPort
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{backgroundColor: 'blue', color: 'white', width: 90, padding: 20, margin: 10}} onClick={this.buyShares}>
            Buy Shares
          </div>

          <div style={{backgroundColor: 'red', color: 'white', width: 90, padding: 20, margin: 10}} onClick={this.sellShares}>
            Sell Shares
          </div>
          <div style={{backgroundColor: 'teal', color: 'black', width: 90, padding: 20, margin: 10}} onClick={this.getBalance}>
            {`Current shares: ${this.state.balance}`}
          </div>
        </div>
      </div>
    )
  }
}

export default App
