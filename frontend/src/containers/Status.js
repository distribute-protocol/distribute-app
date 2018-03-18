import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getEthPriceNow } from 'get-eth-price'

import {eth, web3, tr, rr, dt} from '../utilities/blockchain'
import * as _ from 'lodash'
import StatusComponent from '../components/Status'
// import uport from '../utilities/uport'
// var mnid = require('mnid')

// let uportWR = uport.contract(JSON.parse(ReputationRegistryABI)).at(ReputationRegistryAddress)
class Status extends Component {
  constructor () {
    super()
    this.state = {
      tokensToBuy: ''
    }
    this.getNetworkStatus = this.getNetworkStatus.bind(this)
    this.buyShares = this.buyShares.bind(this)
    this.sellShares = this.sellShares.bind(this)
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
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
    } else {}
    this.getNetworkStatus()
  }
    // let config = {
    //   method: 'GET',
    //   headers: new Headers(),
    //   mode: 'cors',
    //   cache: 'default'
    // }
    // fetch('/api', config).then((res, req) => {})
    // this.queryDatabaseTest()

  async getNetworkStatus () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          let ethPrice = (await getEthPriceNow())
          ethPrice = ethPrice[Object.keys(ethPrice)].ETH.USD
          let balance = (await dt.balanceOf(accounts[0])).toNumber()
          let totalTokenSupply = (await dt.totalSupply()).toNumber()
          let weiBal = (await dt.weiBal()).toNumber()
          let reputationBalance = (await rr.balances(accounts[0])).toNumber()
          let totalReputationSupply = (await rr.totalSupply()).toNumber()
          let first = (await rr.first(accounts[0]))
          let currentPrice = (await dt.currentPrice()).toNumber()
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

  buyShares () {
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
    rr.register({from: accounts[0]})
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
          ethRequired = web3.fromWei(result.toNumber(), 'ether')
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
      <StatusComponent
        totalTokenSupply={this.state.totalTokenSupply}
        balance={this.state.balance}
        marketPercentage={this.state.totalTokenSupply
          ? Math.round(this.state.balance / this.state.totalTokenSupply * 10000) / 100
          : 0}
        ethPool={web3.fromWei(this.state.weiBal, 'ether')}
        capitalEquivalent={this.state.ethPrice
          ? Math.round(this.state.ethPrice * web3.fromWei(this.state.weiBal, 'ether'))
          : 0}
        currentPrice={this.state.currentPrice}
        totalReputationSupply={this.state.totalReputationSupply}
        reputationBalance={this.state.reputationBalance}
        ethToSend={typeof this.state.ethToSend === 'undefined'
          ? 'n/a'
          : Math.round(this.state.ethToSend * 100000) / 100000}
        ethToRefund={typeof this.state.ethToRefund === 'undefined'
          ? 'n/a'
          : Math.round(this.state.ethToRefund * 100000) / 100000}
        getNetworkStatus={this.getNetworkStatus}
        buyShares={this.buyShares}
        sellShares={this.sellShares}
        input={
          <input ref={(input) => (this.tokensToBuy = input)}
            placeholder='Number of Tokens'
            onChange={(e) => this.onChange(this.tokensToBuy.value)}
            value={this.state.tokensToBuy} type='number'
          />}
        notRegistered={(this.state.reputationBalance === 0 && !this.state.first)}
        register={this.register}
        openFaucet={this.state.reputationBalance < 10000}
        faucet={this.faucet}
      />
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
