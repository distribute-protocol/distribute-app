import React, { Component } from 'react'
import StakeComponent from '../../components/project/1Stake'
import moment from 'moment'
import { web3 } from '../../utilities/blockchain'

class StakeProject extends Component {
  constructor () {
    super()
    this.state = {
      stake: ''
    }
    this.tokens = this.tokens.bind(this)
    this.reputation = this.reputation.bind(this)
    this.checkStaked = this.checkStaked.bind(this)
    this.getProjectStatus = this.getProjectStatus.bind(this)
  }

  async getProjectStatus () {
    let projObj = this.props.project
    projObj = Object.assign({}, projObj, {tokensLeft: Math.ceil((parseInt(projObj.weiCost) - projObj.weiBal) / this.props.currentPrice)})
    this.setState({...projObj})
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
      ? this.props.stakeProject('tokens', this.state.stake)
      : this.props.unstakeProject('tokens', this.state.stake)
    this.setState({stake: ''})
  }

  reputation (bool) {
    bool
      ? this.props.stakeProject('reputation', this.state.stake)
      : this.props.unstakeProject('reputation', this.state.stake)
    this.setState({stake: ''})
  }

  checkStaked () {
    this.props.checkStakedStatus()
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
        tokensLeft={parseInt(this.state.weiCost) / this.props.currentPrice}
        reputationCost={this.state.reputationCost}
        totalReputationStaked={this.state.reputationBalance}
        date={moment(this.state.nextDeadline)}
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
        checkStaked={this.checkStakedStatus}
      />
    )
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return bindActionCreators({
//     updateProject
//   }, dispatch)
// }

export default StakeProject
