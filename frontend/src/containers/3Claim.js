import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import Sidebar from '../components/shared/Sidebar'
import { push } from 'react-router-redux'
import { eth } from '../utilities/blockchain'
import Project from './project/3Claim'
import fastforward from '../utilities/fastforward'
import { getProjects, checkValidateStatus } from '../actions/projectActions'
import { submitFinalTaskList, claimTask, submitTaskComplete } from '../actions/taskActions'
import gql from 'graphql-tag'

let projQuery = gql`
    { allProjectsinState(state: 3){
      address,
      id,
      ipfsHash,
      location {
        lat,
        lng
      },
      listSubmitted,
      name
      nextDeadline,
      photo,
      reputationBalance,
      reputationCost,
      summary,
      state,
      tokenBalance,
      topTaskHash,
      taskList,
      weiBal,
      weiCost,
      state,
        tasks {
          id,
          address,
          claimer {
            account
          },
          claimed,
          claimedAt,
          complete,
          description,
          index,
          hash,
          weighting,
          validationRewardClaimable,
          workerRewardClaimable,
          workerRewarded
        }
      }
    }`

class Claim extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    this.fastForward = this.fastForward.bind(this)
    this.submitFinalTaskList = this.submitFinalTaskList.bind(this)
    this.claimTask = this.claimTask.bind(this)
    this.submitTaskComplete = this.submitTaskComplete.bind(this)
    this.checkValidateStatus = this.checkValidateStatus.bind(this)
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

  async submitFinalTaskList (address) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.submitFinalTaskList(address, {from: accounts[0]})
      }
    })
  }

  async claimTask (address, index) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.claimTask(address, index, {from: accounts[0]})
      }
    })
  }

  async submitTaskComplete (address, index) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.submitTaskComplete(address, index, {from: accounts[0]})
      }
    })
  }

  async checkValidateStatus (address) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.checkValidateStatus(address, {from: accounts[0]})
      }
    })
  }

  // fast forward Ganache 1 week
  async fastForward () {
    await fastforward(2 * 7 * 24 * 60 * 60)
  }

  render () {
    const projects = typeof this.props.projects !== `undefined`
      ? Object.keys(this.props.projects).map((address, i) => {
        return <Project
          key={i}
          index={i}
          address={address}
          project={this.props.projects[address]}
          submitFinalTaskList={this.submitFinalTaskList}
          claimTask={this.claimTask}
          submitTaskComplete={this.submitTaskComplete}
          checkValidateStatus={this.checkValidateStatus}
        />
      })
      : []
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Claim Tasks from Active Projects</h3>
            <Button type='danger' onClick={this.fastForward}>fast forward 2 weeks</Button>
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

const mapStateToProps = (state) => {
  return {
    projects: state.projects[3]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/')),
    getProjects: () => dispatch(getProjects(3, projQuery)),
    submitFinalTaskList: (address, txObj) => dispatch(submitFinalTaskList(address, txObj)),
    claimTask: (address, index, txObj) => dispatch(claimTask(address, index, txObj)),
    submitTaskComplete: (address, index, txObj) => dispatch(submitTaskComplete(address, index, txObj)),
    checkValidateStatus: (address, txObj) => dispatch(checkValidateStatus(address, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Claim)
