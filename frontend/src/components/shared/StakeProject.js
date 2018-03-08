import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { Card, Button } from 'antd'
import {eth, web3, dt, pr, P} from '../../utilities/blockchain'
import { updateProject } from '../../actions/projectActions'
const ButtonGroup = Button.Group
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
      <div style={{backgroundColor: '#DDE4E5'}}>
        <div style={{padding: 10}}>
          <h3>{this.props.description}</h3>
        </div>
        <div style={{padding: 10, paddingTop: 0}}>
          <div style={{wordWrap: 'break-word'}}>{`Address: ${this.props.address}`}</div>
          <div>Cost: {`${this.props.cost}`} ETH</div>
          <div>Tokens Remaining: {`${this.state.tokensLeft}`}</div>
          <div>Reputation Remaining {`${this.state.reputationCost}`}</div>
          {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
          <div>Expiration: {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</div>
          <div style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
            <input
              ref={(input) => (this.stakedValue = input)}
              placeholder='Amount'
              onChange={() => this.onChange(this.stakedValue.value)}
              value={this.state.tokensToStake}
              style={{height: 30, marginRight: 15}}
            />
            <div>
              <div>
                <ButtonGroup>
                  <Button style={{backgroundColor: '#0B1899', color: 'white'}} icon='up-circle-o' color='primary' onClick={() => this.stakeTokens()}>
                    Tokens
                  </Button>
                  <Button style={{backgroundColor: '#08734E', color: 'white'}} icon='up-circle-o' color='primary' onClick={() => this.stakeReputation()}>
                    Reputation
                  </Button>

                </ButtonGroup>
              </div>
              <div style={{marginTop: 5}}>
                <ButtonGroup>
                  <Button style={{backgroundColor: '#1FA9FF', color: 'white'}} icon='down-circle-o' color='primary' onClick={() => this.unstakeTokens()}>
                    Tokens
                  </Button>
                  <Button style={{backgroundColor: '#0BA16D', color: 'white'}} icon='down-circle-o' color='primary' onClick={() => this.unstakeReputation()}>
                    Reputation
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <Button onClick={() => this.checkStaked()}>
            Check Staked
          </Button>
        </div>
      </div>
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
