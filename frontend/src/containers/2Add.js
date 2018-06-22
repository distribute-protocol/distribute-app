import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import { Button } from 'antd'
import { push } from 'react-router-redux'
import { eth } from '../utilities/blockchain'
import Project from './project/2Add'
import fastforward from '../utilities/fastforward'
import { getProjects, checkActiveStatus } from '../actions/projectActions'
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
      summary,
      tokenBalance,
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
    this.checkStakedStatus = this.checkStakedStatus.bind(this)
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

  checkActiveStatus (address) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.checkActiveStatus(address, {from: accounts[0]})
      }
    })
  }

  setTaskSubmission () {
    // let tasks = this.props.taskList
    // let sumTotal = tasks.map(el => el.percentage).reduce((prev, curr) => {
    //   return prev + curr
    // }, 0)
    // if (sumTotal !== 100) {
    //   alert('percentages must add up to 100!')
    // } else {
    //   let taskArray = tasks.map(task => ({
    //     description: task.description,
    //     weiReward: task.percentage * this.state.weiCost / 100
    //   }))
    //   let taskHash = hashTasksArray(taskArray, this.state.weiCost)
    //   eth.getAccounts(async (err, accounts) => {
    //     if (!err) {
    //       await pr.addTaskHash(this.props.address, taskHash, {from: accounts[0]}).then(() => { // change to epic
    //         this.props.setTaskSubmission({
    //           address: this.props.address,
    //           submitter: accounts[0],
    //           taskSubmission: taskArray
    //         })
    //       })
    //     }
    //   })
  }
  // fast forward Ganache 1 week
  async fastForward () {
    await fastforward(7 * 24 * 60 * 60)
  }

  render () {
    const projects = typeof this.props.projects !== `undefined`
      ? Object.keys(this.props.project).map((address, i) => {
        return <Project
          key={i}
          index={i}
          address={address}
          project={this.props.project[address]}
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
    getProjects: () => dispatch(getProjects(2, projQuery))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add)
