import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
// import { Card, CardBody, CardTitle, CardText, Button, Col } from 'reactstrap'
import { Card, Button } from 'antd'
import {eth, web3, dt, P} from '../../utilities/blockchain'

const getProjectState = () => ({ type: 'GET_PROJECT_STATE' })

class StakeProject extends Component {
  constructor () {
    super()
    this.state = {
      value: 0,
      tokensToStake: ''
    }
  }

  getProjectStatus (p) {
    let accounts
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        console.log(accounts)
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
              // console.log('currentPrice', currentPrice)
              this.setState({
                weiBal,
                weiCost,
                reputationCost,
                totalTokensStaked,
                totalReputationStaked,
                currentPrice: web3.fromWei(currentPrice, 'ether')
              })
              console.log('state', this.state)
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
    console.log('tokensLeft', tokensLeft)
  }

  componentWillMount () {
    // let p = P.at(this.props.address)
    let p = P.at(this.props.address)
    // console.log(p)
    this.getProjectStatus(p)
    this.setState({project: p})
  }

  onChange (val) {
    try {
      this.setState({tokensToStake: val})
      // console.log('set state for description')
    } catch (error) {
      throw new Error(error)
    }
  }

  stakeProject () {
    this.props.stakeProject(this.state.tokensToStake)
    this.setState({tokensToStake: ''})
  }

  unstakeProject () {
    this.props.unstakeProject(this.state.tokensToStake)
    this.setState({tokensToStake: ''})
  }

  render () {
    let d
    // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
    if (typeof this.props.stakingEndDate !== 'undefined') { d = moment(this.props.stakingEndDate) }
    // console.log(this.state)
    return (
      // <Col sm='10'>
      <Card title={`${this.props.description}`}>
        <div style={{wordWrap: 'break-word'}}>{`${this.props.address}`}</div>
        <div>project funds: {`${this.props.cost}`} ETH</div>
        <div>needs {`${this.state.tokensLeft}`} tokens</div>
        {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
        <div>staking expires in {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</div>
        <input
          ref={(input) => (this.stakedValue = input)}
          placeholder='token amount'
          onChange={() => this.onChange(this.stakedValue.value)}
          value={this.state.tokensToStake}
        />
        <Button color='primary' onClick={() => this.stakeProject()}>
          Stake
        </Button>
        <Button color='primary' onClick={() => this.unstakeProject()}>
          Unstake
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
    getProjectState: getProjectState
  }, dispatch)
  // return {
  //   getProjectState: () => console.log('heyhey')
  // }
}
 // = ({cost, description, stakingEndDate, address, index, stakeProject, unstakeProject, stakingAmount}) => {

export default connect(mapStateToProps, mapDispatchToProps)(StakeProject)
