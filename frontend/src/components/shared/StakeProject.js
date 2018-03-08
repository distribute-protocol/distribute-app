import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { Card, Button } from 'antd'
import {eth, web3, dt, pr, P} from '../../utilities/blockchain'
import { updateProject } from '../../actions/projectActions'

const getProjectState = () => ({ type: 'GET_PROJECT_STATE' })

class StakeProject extends Component {
  constructor () {
    super()
    this.state = {
      value: 0,
      stake: ''
    }
  }

  getProjectStatus (p) {
    let accounts
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        // console.log(accounts)
        if (accounts.length) {
          let weiBal,
            weiCost,
            reputationCost,
            totalTokensStaked,
            totalReputationStaked
          let currentPrice
          p.weiBal().then(result => {
            weiBal = result.toNumber()
            // console.log('weiBal', weiBal)
            // console.log('p', p)
          }).then(() => {
            p.weiCost().then(result => {
              weiCost = result.toNumber()
              // console.log('weiCost', weiCost)
            })
          }).then(() => {
            p.reputationCost().then(result => {
              reputationCost = result.toNumber()
              // console.log('reputationCost', reputationCost)
            })
          }).then(() => {
            p.totalTokensStaked().then(result => {
              totalTokensStaked = result.toNumber()
              // console.log('totalTokensStaked', totalTokensStaked)
            })
          }).then(() => {
            p.totalReputationStaked().then(result => {
              totalReputationStaked = result.toNumber()
              // console.log('totalReputationStaked', totalReputationStaked)
            })
          }).then(() => {
            dt.currentPrice().then(result => {
              currentPrice = result.toNumber()
              let projObj = {
                weiBal,
                weiCost,
                reputationCost,
                totalTokensStaked,
                totalReputationStaked,
                currentPrice: web3.fromWei(currentPrice, 'ether')
              }
              this.props.updateProject(this.props.address, projObj)
              this.setState(projObj)
              this.getTokensLeft()
            })
          })
        }
      }
    })
  }

  getTokensLeft () {
    let weiNeeded = this.state.weiCost - this.state.weiBal
    let tokensLeft = Math.ceil(weiNeeded / web3.toWei(this.state.currentPrice, 'ether'))
    this.setState({tokensLeft})
    // console.log('tokensLeft', tokensLeft)
  }

  componentWillMount () {
    // let p = P.at(this.props.address)
    let p = P.at(this.props.address)
    this.getProjectStatus(p)
    this.setState({project: p})
  }

  onChange (val) {
    try {
      this.setState({stake: val})
      // console.log('set state for description')
    } catch (error) {
      throw new Error(error)
    }
  }

  stakeTokens () {
    this.props.stakeTokens(this.state.stake)
    this.setState({stake: ''})
  }

  unstakeTokens () {
    this.props.unstakeTokens(this.state.stake)
    this.setState({stake: ''})
  }

  stakeReputation () {
    this.props.stakeReputation(this.state.stake)
    this.setState({stake: ''})
  }

  unstakeReputation () {
    this.props.unstakeReputation(this.state.stake)
    this.setState({stake: ''})
  }

  checkStaked () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.checkStaked(this.props.address, {from: accounts[0]}).then((res) => {
          console.log(res)
        })
      }
    })
  }

  render () {
    let d
    if (typeof this.props.stakingEndDate !== 'undefined') { d = moment(this.props.stakingEndDate) }
    return (
      <Card title={`${this.props.description}`}>
        <div style={{wordWrap: 'break-word'}}>{`${this.props.address}`}</div>
        <div>project funds: {`${this.props.cost}`} ETH</div>
        <div>needs {`${this.state.tokensLeft}`} tokens</div>
        <div>needs {`${this.state.reputationCost}`} reputation</div>
        {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
        <div>staking expires in {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</div>
        <input
          ref={(input) => (this.stakedValue = input)}
          placeholder='token amount'
          onChange={() => this.onChange(this.stakedValue.value)}
          value={this.state.tokensToStake}
        />
        <Button color='primary' onClick={() => this.stakeTokens()} style={{marginLeft: 10}}>
          Stake Tokens
        </Button>
        <Button color='primary' onClick={() => this.unstakeTokens()} style={{marginLeft: 10}}>
          Unstake Tokens
        </Button>
        <Button color='primary' onClick={() => this.stakeReputation()} style={{marginLeft: 10}}>
          Stake Reputation
        </Button>
        <Button color='primary' onClick={() => this.unstakeReputation()} style={{marginLeft: 10}}>
          Unstake Reputation
        </Button>
        <Button
          onClick={() => this.checkStaked()}
        >
          Check Staked
        </Button>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projectState: state.projects.fetching,
    project: state.projects.project
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getProjectState,
    updateProject
  }, dispatch)
  // return {
  //   getProjectState: () => console.log('heyhey')
  // }
}
 // = ({cost, description, stakingEndDate, address, index, stakeTokens, unstakeTokens, stakingAmount}) => {

export default connect(mapStateToProps, mapDispatchToProps)(StakeProject)
