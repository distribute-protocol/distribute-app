import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StakeComponent from '../../components/project/1Stake'
import moment from 'moment'
import {eth, web3, dt, P} from '../../utilities/blockchain'
import { updateProject } from '../../actions/projectActions'
import ipfsAPI from 'ipfs-api'
let ipfs = ipfsAPI()

class StakeProject extends Component {
  constructor () {
    super()
    this.state = {
      stake: ''
    }
    this.tokens = this.tokens.bind(this)
    this.reputation = this.reputation.bind(this)
    this.checkStaked = this.checkStaked.bind(this)
  }

  async getProjectStatus () {
    let accounts
    let p = P.at(this.props.address)
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        if (accounts.length) {
          let weiBal = (await p.weiBal()).toNumber()
          let weiCost = (await p.weiCost()).toNumber()
          let reputationCost = (await p.reputationCost()).toNumber()
          let totalTokensStaked = (await p.tokensStaked()).toNumber()
          let totalReputationStaked = (await p.reputationStaked()).toNumber()
          let ipfsHash = web3.toAscii(await p.ipfsHash())
          let currentPrice = (await dt.currentPrice()).toNumber()
          let projObj = {
            weiBal,
            weiCost,
            reputationCost,
            totalTokensStaked,
            totalReputationStaked,
            ipfsHash,
            currentPrice
          }
          ipfs.object.get(ipfsHash, (err, node) => {
            if (err) {
              throw err
            }
            let dataString = new TextDecoder('utf-8').decode(node.toJSON().data)
            projObj = Object.assign({}, projObj, JSON.parse(dataString), {tokensLeft: Math.ceil((weiCost - weiBal) / currentPrice)})
            this.props.updateProject(this.props.address, projObj)
            this.setState({...projObj, project: p})
          })
        }
      }
    })
  }

  componentWillMount () {
    this.getProjectStatus()
  }

  onChange (val) {
    try {
      this.setState({stake: val})
    } catch (error) {
      throw new Error(error)
    }
  }

  tokens (bool) {
    bool
    ? this.props.stakeTokens(this.state.stake)
    : this.props.unstakeTokens(this.state.stake)
    this.setState({stake: ''})
  }

  reputation (bool) {
    bool
    ? this.props.stakeReputation(this.state.stake)
    : this.props.unstakeReputation(this.state.stake)
    this.setState({stake: ''})
  }

  checkStaked () {
    this.props.checkStaked()
  }

  render () {
    return (
      <StakeComponent
        name={this.state.name}
        address={this.props.address}
        photo={this.state.photo}
        summary={this.state.summary}
        location={this.state.location}
        cost={web3.fromWei(this.state.cost, 'ether')}
        tokensLeft={this.state.tokensLeft}
        reputationCost={this.state.reputationCost}
        totalReputationStaked={this.state.totalReputationStaked}
        date={moment(this.state.stakingEndDate)}
        stakeInput={
          <input
            ref={(input) => (this.stakedValue = input)}
            placeholder='Amount'
            type='number'
            onChange={() => this.onChange(this.stakedValue.value)}
            value={this.state.tokensToStake}
            style={{height: 30, marginRight: 15}}
          />
        }
        tokens={this.tokens}
        reputation={this.reputation}
        checkStaked={this.checkStaked}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateProject
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(StakeProject)
