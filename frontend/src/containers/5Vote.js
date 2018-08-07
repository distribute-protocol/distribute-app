import React from 'react'
import { Button } from 'antd'
import { push } from 'react-router-redux'
import Sidebar from '../components/shared/Sidebar'
import Project from './project/5Vote'
import fastforward from '../utilities/fastforward'
import { connect } from 'react-redux'
import { eth } from '../utilities/blockchain'
import { getProjects } from '../actions/projectActions'
import { rewardValidator } from '../actions/taskActions'
import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 5){
      address,
      id,
      ipfsHash,
      location {
        lat,
        lng
      },
      name
      nextDeadline,
      photo,
      reputationBalance,
      reputationCost,
      summary,
      tokenBalance,
      weiBal,
      weiCost
    }
  }`

class Vote extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    this.fastForward = this.fastForward.bind(this)
    this.rewardValidator = this.rewardValidator.bind(this)
  }

  componentWillMount () {
    this.getProjects()
  }

  async getProjects () {
    eth.getAccounts(async (err, result) => {
      if (!err) {
        if (result.length) {
          this.props.getProjects()
        } else {
          console.log('Please Unlock MetaMask')
        }
      }
    })
  }

  async rewardValidator (address, index) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.rewardValidator(address, index, {from: accounts[0]})
        // await tr.rewardValidator(this.props.address, i, {from: accounts[0]})
      }
    })
  }

  async fastForward () {
    await fastforward(7 * 24 * 60 * 60)
  }

  render () {
    const projects = typeof this.props.projects !== `undefined`
      ? Object.keys(this.props.projects).map((address, i) => {
        return <Project
          key={i}
          index={i}
          address={address}
          project={this.props.projects[address]}
          rewardValidator={this.rewardValidator}
          validations={(address) => this.getValidations(address)}
        />
      })
      : []
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Vote Tasks</h3>
            <Button type='danger' onClick={this.fastForward}>fast forward 1 week</Button>
            <h6>ONLY DO THIS IF YOU ARE READY TO MOVE EVERY PROJECT TO THE NEXT STATE</h6>
            <h6>IF A PROJECT HAS UNCLAIMED TASKS IT WILL FAIL AND YOU WILL LOSE YOUR STAKED TOKENS</h6>
          </header>
          <div style={{paddingLeft: '30px', paddingRight: '30px'}}>
            {projects}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: state.projects[5]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/')),
    getProjects: () => dispatch(getProjects(5, projQuery)),
    rewardValidator: (address, index, txObj) => dispatch(rewardValidator(address, index, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vote)
