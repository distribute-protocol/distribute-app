import React, { Component } from 'react'
import { TokenHolderRegistryABI, TokenHolderRegistryAddress, TokenHolderRegistryBytecode } from './abi/TokenHolderRegistry'
import { WorkerRegistryABI, WorkerRegistryAddress, WorkerRegistryBytecode } from './abi/WorkerRegistry'
import logo from './logo.svg'
import './App.css'
import ETH from 'ethjs'
import uport from './util/uport'
var mnid = require('mnid')
const eth = new ETH(window.web3.currentProvider)
window.eth = eth
// console.log(TokenHolderRegistryABI, WorkerRegistryABI)
// .at(TokenHolderRegistryAddress)
// const WR = eth.contract(JSON.parse(WorkerRegistryABI), WorkerRegistryBytecode)
// .at(WorkerRegistryAddress)
let THR
let WR
let thr
let wr
eth.accounts().then(accounts => {
  THR = eth.contract(JSON.parse(TokenHolderRegistryABI), TokenHolderRegistryBytecode, {
    from: accounts[0],
    gas: 6385876
  })
  WR = eth.contract(JSON.parse(WorkerRegistryABI), WorkerRegistryBytecode, {
    from: accounts[0],
    gas: 6385876
  })
  thr = THR.at(TokenHolderRegistryAddress)
  wr = WR.at(WorkerRegistryAddress)
  window.THR = thr
  window.WR = wr
  // console.log(wr)
  // wr.register(0, {from: accounts[0]})
  thr.mint(700, {value: "15000000000000000000", from: accounts[0]})
  thr.balanceOf(accounts[0]).then(balance => console.log(balance))
  // thr.mint(700, {value: "15000000000000000000", from: accounts[0]})
})

let uportWR = uport.contract(JSON.parse(WorkerRegistryABI)).at(WorkerRegistryAddress)
// window.THR = thr
// window.WR = wr
window.uportWR = uportWR

class App extends Component {
  login () {
    uport.requestCredentials({
      requested: ['name', 'avatar'],
      notifications: true
    }).then((credentials) => {
      console.log(credentials)
      console.log(mnid.decode(credentials.address))
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
    // let thr = THR.new((error, res) => {
    //   console.log(res)
    //   return res
    // })
    // let wr = WR.new((error, res) => {
    //   console.log(res)
    //   return res
    // })
  }
  render () {
    // console.log(THR, WR)
    // eth.accounts().then(accounts => console.log(accounts[0]))
    // WR.register().then((thing) => console.log(thing))
    console.log(window.web3.accounts)
    eth.accounts().then(accounts => {
      // console.log(WR.totalWorkerTokenSupply)
    })
    // WR.register({from: })
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div onClick={this.login}>
          <h3>Connect with uPort</h3>
        </div>
      </div>
    )
  }
}

export default App
