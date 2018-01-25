import React, { Component } from 'react'
import moment from 'moment'
import { Card, CardBody, CardTitle, CardText, Button, Col } from 'reactstrap'
import { eth, web3, tr, dt, P, gorbeon } from '../../utilities/blockchain'

class StakeProject extends Component {
  constructor () {
    super()
    this.state = {
      value: 0
    }
    this.stakeProject = this.stakeProject.bind(this)
    this.getProjectStatus = this.getProjectStatus.bind(this)
    window.gorbeon = gorbeon
  }

  async getProjectStatus (p) {
    try {
      let accounts
      if (this.state.p2) {
        let totalTokensStaked2 = await this.state.p2.totalTokensStaked()
        console.log(totalTokensStaked2)
      }
      eth.getAccounts((err, result) => {
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
            p.weiBal((err, weiBalResult) => {
              if (!err) {
                p.weiCost((err, weiCostResult) => {
                  if (!err) {
                    p.reputationCost((err, reputationCostResult) => {
                      if (!err) {
                        p.totalTokensStaked((err, totalTokensStakedResult) => {
                          if (!err) {
                            p.totalReputationStaked((err, totalReputationStakedResult) => {
                              if (!err) {
                                dt.currentPrice((err, val) => {
                                  if (!err) {
                                    weiBal = weiBalResult.toNumber()
                                    console.log('weiBal', weiBal)
                                    weiCost = weiCostResult.toNumber()
                                    console.log('weiCost', weiCost)
                                    reputationCost = reputationCostResult.toNumber()
                                    console.log('reputationCost', reputationCost)
                                    totalTokensStaked = totalTokensStakedResult.toNumber()
                                    console.log('totalTokensStaked', totalTokensStaked)
                                    totalReputationStaked = totalReputationStakedResult.toNumber()
                                    console.log('totalReputationStaked', totalReputationStaked)
                                    currentPrice = val.toNumber()
                                    console.log('currentPrice', currentPrice)
                                    this.setState({
                                      weiBal,
                                      weiCost,
                                      reputationCost,
                                      totalTokensStaked,
                                      totalReputationStaked,
                                      currentPrice: web3.fromWei(currentPrice, 'ether')
                                    })
                                    console.log(this.state)
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  componentWillMount () {
    let p = P.at(this.props.address)
    let p2 = gorbeon.at(this.props.address)
    window.p2 = p2
    // console.log(p)
    this.getProjectStatus(p)
    this.setState({project: p, p2})
  }

  onChange (val) {
    try {
      this.setState({value: val})
      // console.log('set state for description')
    } catch (error) {
      throw new Error(error)
    }
  }

  stakeProject () {
    this.props.stakeProject(this.state.value, () => { console.log('entering the void'); this.getProjectStatus(this.state.project) })
    this.setState({value: 0})
  }

  render () {
    let d
    // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
    if (typeof this.props.stakingEndDate !== 'undefined') { d = moment(this.props.stakingEndDate) }
    // console.log(this.state)
    return (
      <Col sm='10'>
        <Card body style={{marginLeft: 10}}>
          <CardBody>
            <CardTitle>{`${this.props.description}`}</CardTitle>
            <CardText>{`${this.props.address}`}</CardText>
            <CardText>{`${this.props.cost}`} ETH</CardText>
            <CardText>needs {`${this.state.tokensLeft}`} tokens</CardText>
            {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
            <CardText>staking expires in {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</CardText>
            <input
              ref={(input) => (this.stakedValue = input)}
              placeholder='token amount'
              onChange={() => this.onChange(this.stakedValue.value)}
              value={this.state.value}
            />
            <Button color='primary' onClick={this.stakeProject} style={{marginLeft: 10}}>
              Stake
            </Button>
            <Button color='primary' onClick={() => this.props.unstakeProject(this.state.value)} style={{marginLeft: 10}}>
              Unstake
            </Button>
            <Button color='secondary' onClick={() => this.getProjectStatus(this.state.project)} style={{marginLeft: 10}}>
              PROJECT STATE
            </Button>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

 // = ({cost, description, stakingEndDate, address, index, stakeProject, unstakeProject, stakingAmount}) => {

export default StakeProject
