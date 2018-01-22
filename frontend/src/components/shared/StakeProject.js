import React, { Component } from 'react'
import moment from 'moment'
import { Card, CardBody, CardTitle, CardText, Button, Col } from 'reactstrap'
import {eth, web3, tr, dt, P} from '../../utilities/blockchain'

class StakeProject extends Component {
  constructor () {
    super()
    this.state = {
      value: 0
    }
  }

  async getProjectStatus (p) {
    try {
      let accounts = await eth.accounts
      if (accounts.length) {
        let weiBal,
            weiCost,
            reputationCost,
            totalTokensStaked,
            totalReputationStaked
        let currentPrice
        await p.weiBal((err, val) => {
          if (!err) {
            weiBal = val.toNumber()
          }
        })
        // await p.weiCost((err, val) => {
        //   if (!err) {
        //     weiCost = val.toNumber()
        //   }
        // })
        // await p.reputationCost((err, val) => {
        //   if (!err) {
        //     reputationCost = val.toNumber()
        //     console.log('repcost', reputationCost)
        //   }
        // })
        await p.totalTokensStaked((err, val) => {
          if (!err) {
            totalTokensStaked = val.toNumber()
          }
        })
        // await p.totalReputationStaked((err, val) => {
        //   if (!err) {
        //     totalReputationStaked = val.toNumber()
        //   }
        // })
        await dt.currentPrice((err, val) => {
          if (!err) {
            currentPrice = val.toNumber()
            this.setState({
              weiBal,
              // weiCost,
              // reputationCost,
              totalTokensStaked,
              // totalReputationStaked,
              currentPrice: web3.fromWei(currentPrice, 'ether')
            })
          }
        })
      } else {
        console.error('Please Unlock MetaMask')
      }
    } catch (error) {
      console.error(error)
    }
  }

  componentWillMount () {
    let p = P.at(this.props.address)
    this.getProjectStatus(p)
    this.setState({project: p})
  }

  onChange (val) {
    try {
      this.setState({value: val})
      // console.log('set state for description')
    } catch (error) {
      throw new Error(error)
    }
  }

  render () {
    let d
    // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
    if (typeof this.props.stakingEndDate !== 'undefined') { d = moment(this.props.stakingEndDate) }
    console.log(this.state)
    return (
      <Col sm='10'>
        <Card body style={{marginLeft: 10}}>
          <CardBody>
            <CardTitle>{`${this.props.description}`}</CardTitle>
            <CardText>{`${this.props.address}`}</CardText>
            <CardText>{`${this.props.cost}`} ETH</CardText>
            <CardText>needs {`${this.props.cost}`} tokens</CardText>
            {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
            <CardText>staking expires in {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</CardText>
            <input
              ref={(input) => (this.stakedValue = input)}
              placeholder='token amount'
              onChange={() => this.onChange(this.stakedValue.value)}
              value={this.state.value}
            />
            <Button color='primary' onClick={() => this.props.stakeProject(this.state.value)} style={{marginLeft: 10}}>
              Stake
            </Button>
            <Button color='primary' onClick={() => this.props.unstakeProject(this.state.value)} style={{marginLeft: 10}}>
              Unstake
            </Button>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

 // = ({cost, description, stakingEndDate, address, index, stakeProject, unstakeProject, stakingAmount}) => {

export default StakeProject
