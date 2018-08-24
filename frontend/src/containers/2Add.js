import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import { Button } from 'antd'
import { push } from 'react-router-redux'
import { eth } from '../utilities/blockchain'
import Project from './project/2Add'
import fastforward from '../utilities/fastforward'
import { getProjects, checkActiveStatus, setTaskList, getVerifiedTaskLists } from '../actions/projectActions'
import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 2){
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
      state,
      summary,
      tokenBalance,
      taskList,
      weiBal,
      weiCost
    }
  }`

class Add extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    this.fastForward = this.fastForward.bind(this)
    this.setTaskList = this.setTaskList.bind(this)
    this.checkActiveStatus = this.checkActiveStatus.bind(this)
    // this.submitHashedTaskList = this.submitHashedTaskList.bind(this)
    this.getVerifiedTaskLists = this.getVerifiedTaskLists.bind(this)
  }

  componentWillMount () {
    this.getProjects()
  }

  async getProjects () {
    eth.getAccounts(async (err, result) => {
      if (!err) {
        if (result.length) {
          this.props.getProjects()
          this.setState({user: result[0]})
        } else {
          console.log('Please Unlock MetaMask')
        }
      }
    })
  }

  async checkActiveStatus (address) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.checkActiveStatus(address, {from: accounts[0]})
      }
    })
  }

  async setTaskList (taskDetails, address) {
    this.props.setTaskList(taskDetails, address)
  }

  getVerifiedTaskLists (address) {
    this.props.getVerifiedTaskLists(address)
    return 0
  }
  // fast forward Ganache 1 week
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
          setTaskList={(taskDetails, address) => this.setTaskList(taskDetails, address)}
          getVerifiedTaskLists={(address) => this.getVerifiedTaskLists(address)}
          // submitHashedTaskList={(tasks, taskHash, address) => this.submitHashedTaskList(tasks, taskHash, address)}
          checkActiveStatus={(address) => this.checkActiveStatus(address)}
          user={this.state.user}
        />
      })
      : []
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Add Tasks to Open Projects</h3>
            <Button type='danger' onClick={this.fastForward}>fast forward 1 week</Button>
            <h6>ONLY DO THIS IF YOU ARE READY TO MOVE EVERY PROJECT TO THE NEXT STATE</h6>
            <h6>IF A PROJECT HAS NO TASK SUBMISSIONS IT WILL FAIL AND YOU WILL LOSE YOUR STAKED TOKENS</h6>
          </header>
          <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
            {projects}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects[2]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/')),
    getProjects: () => dispatch(getProjects(2, projQuery)),
    getVerifiedTaskLists: (projectAddress) => dispatch(getVerifiedTaskLists(projectAddress)),
    checkActiveStatus: (projectAddress, txObj) => dispatch(checkActiveStatus(projectAddress, txObj)),
    // submitHashedTaskList: (tasks, taskHash, projectAddress, txObj) => dispatch(submitHashedTaskList(tasks, taskHash, projectAddress, txObj)),
    setTaskList: (taskDetails, projectAddress) => dispatch(setTaskList(taskDetails, projectAddress))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add)
