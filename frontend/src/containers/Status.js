import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getEthPriceNow } from 'get-eth-price'
import {eth, web3, dt} from '../utilities/blockchain'
import * as _ from 'lodash'
import StatusComponent from '../components/Status'
import { getNetworkStatus } from '../actions/networkActions'
import { getUserStatus } from '../actions/userActions'
import { mintTokens, sellTokens } from '../actions/tokenActions'

class Status extends Component {
  constructor () {
    super()
    this.state = {
      tokensToBuy: ''
    }
    this.getNetworkStatus = this.getNetworkStatus.bind(this)
    this.getPriceData = this.getPriceData.bind(this)
    this.mintTokens = this.mintTokens.bind(this)
    this.sellTokens = this.sellTokens.bind(this)
  }

  componentWillMount () {
    if (_.isEmpty(this.props.user)) {
    } else {}
    this.getNetworkStatus()
    this.getPriceData()
  }

  componentWillReceiveProps () {
    this.getPriceData()
  }

  async getPriceData () {
    let ethPrice = await getEthPriceNow()
    ethPrice = ethPrice[Object.keys(ethPrice)].ETH.USD
    let weiBal = (await dt.weiBal()).toNumber()
    let currentPrice = (await dt.currentPrice()).toNumber()
    this.setState({
      ethPrice,
      weiBal,
      currentPrice: web3.fromWei(currentPrice, 'ether')
    })
  }

  getNetworkStatus () {
    this.props.getNetworkStatus()
    this.getPriceData()
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          // get user token balance
          this.props.getUserStatus(accounts[0])
        } else {
          alert('Please Unlock MetaMask')
        }
      }
    })
  }

  mintTokens () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.mintTokens(this.tokensToBuy.value, {value: web3.toWei(Math.ceil(this.state.ethToSend * 100000) / 100000, 'ether'), from: accounts[0]})
          this.setState({
            tokensToBuy: ''
          })
        }
      }
    })
  }

  sellTokens () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.sellTokens(this.tokensToBuy.value, {from: accounts[0]})
          this.setState({
            tokensToBuy: ''
          })
        }
      }
    })
  }

  async onChange (val) {
    this.setState({tokensToBuy: val})
    if (val > 0) {
      try {
        let ethRequired, totalSupply, refund
        await dt.weiRequired(val).then(result => {
          ethRequired = web3.fromWei(result.toNumber(), 'ether')
        })
        totalSupply = this.props.totalSupply
        if (totalSupply === 0) {
          refund = ethRequired
        } else {
          await dt.currentPrice().then(currPrice => {
            refund = web3.fromWei(currPrice.toNumber() * val, 'ether')
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
        totalTokenSupply={this.props.network.totalTokens}
        balance={this.props.user.userTokens}
        marketPercentage={this.props.user.userTokens
          ? Math.round(this.props.user.userTokens / this.props.network.totalTokens * 10000) / 100
          : 0}
        ethPool={web3.fromWei(this.state.weiBal, 'ether')}
        capitalEquivalent={this.state.ethPrice
          ? parseFloat(this.state.ethPrice * web3.fromWei(this.state.weiBal, 'ether')).toFixed(2)
          : 0}
        currentPrice={this.state.currentPrice}
        currentPriceUSD={this.state.currentPrice
          ? parseFloat(this.state.currentPrice * web3.fromWei(this.state.weiBal, 'ether')).toFixed(5)
          : 0}
        totalReputationSupply={this.props.network.totalReputation}
        reputationBalance={this.props.user.userReputation}
        ethToSend={typeof this.state.ethToSend === 'undefined'
          ? 'n/a'
          : Math.round(this.state.ethToSend * 100000) / 100000}
        ethToRefund={typeof this.state.ethToRefund === 'undefined'
          ? 'n/a'
          : Math.round(this.state.ethToRefund * 100000) / 100000}
        getNetworkStatus={this.getNetworkStatus}
        mintTokens={this.mintTokens}
        sellTokens={this.sellTokens}
        input={
          <input ref={(input) => (this.tokensToBuy = input)}
            placeholder='Number of Tokens'
            onChange={(e) => this.onChange(this.tokensToBuy.value)}
            value={this.state.tokensToBuy} type='number'
          />}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user || {},
    network: state.network
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/')),
    getNetworkStatus: () => dispatch(getNetworkStatus()),
    getUserStatus: (userAccount) => dispatch(getUserStatus(userAccount)),
    mintTokens: (amount, txObj) => dispatch(mintTokens(amount, txObj)),
    sellTokens: (amount, txObj) => dispatch(sellTokens(amount, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Status)
