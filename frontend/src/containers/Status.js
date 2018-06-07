import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getEthPriceNow } from 'get-eth-price'

import {eth, web3, rr, dt} from '../utilities/blockchain'
import * as _ from 'lodash'
import StatusComponent from '../components/Status'
import { getNetworkStatus, getUserStatus } from '../actions/getters/statusGetterActions'

class Status extends Component {
  constructor () {
    super()
    this.state = {
      tokensToBuy: ''
    }
    this.getNetworkStatus = this.getNetworkStatus.bind(this)
    this.buyShares = this.buyShares.bind(this)
    this.sellShares = this.sellShares.bind(this)
    this.register = this.register.bind(this)
  }

  componentWillMount () {
    if (_.isEmpty(this.props.user)) {
    } else {}
    this.getNetworkStatus()
  }

  async getNetworkStatus () {
    this.props.getNetworkStatus()
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.setState({userAccount: accounts[0]})
          // get user token balance
          this.props.getUserStatus(accounts[0])
          let ethPrice = await getEthPriceNow()
          ethPrice = ethPrice[Object.keys(ethPrice)].ETH.USD
          let weiBal = (await dt.weiBal()).toNumber()
          let first = (await rr.first(accounts[0]))
          let currentPrice = (await dt.currentPrice()).toNumber()
          this.setState({
            ethPrice,
            weiBal,
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
          await this.getNetworkStatus()
          this.setState({
            tokensToBuy: ''
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
          await this.getNetworkStatus()
          this.setState({
            tokensToBuy: ''
          })
        }
      }
    })
  }

  register () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          await rr.register({from: accounts[0]})
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
        totalTokenSupply={this.props.status.totalTokens}
        balance={this.props.status.userTokens !== undefined
          ? this.props.status.userTokens
          : 0}
        marketPercentage={this.props.status.userTokens
          ? Math.round(this.props.status.userTokens / this.props.status.totalTokens * 10000) / 100
          : 0}
        ethPool={web3.fromWei(this.state.weiBal, 'ether')}
        capitalEquivalent={this.state.ethPrice
          ? Math.round(this.state.ethPrice * web3.fromWei(this.state.weiBal, 'ether'))
          : 0}
        currentPrice={this.state.currentPrice}
        totalReputationSupply={this.props.status.totalReputation}
        reputationBalance={this.props.status.userReputation !== undefined
          ? this.props.status.userReputation
          : 0}
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
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    status: state.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/')),
    getNetworkStatus: () => dispatch(getNetworkStatus()),
    getUserStatus: (userAccount) => dispatch(getUserStatus(userAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Status)
