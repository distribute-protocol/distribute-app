import React from 'react'
import { connect } from 'react-redux'
import ClaimComponent from '../../components/project/3Claim'
import { Button } from 'antd'
import {eth, web3, rr, pr} from '../../utilities/blockchain'
// import { hashTasksArray, hashTasks } from '../../utilities/hashing'
import { getTasks } from '../../actions/taskActions'
import moment from 'moment'

const ButtonGroup = Button.Group

class ClaimProject extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: []
    }
    this.getProjectStatus = this.getProjectStatus.bind(this)
    this.submitFinalTaskList = this.submitFinalTaskList.bind(this)
    this.checkValidateStatus = this.checkValidateStatus.bind(this)
  }

  componentWillMount () {
    this.getProjectStatus()
    this.getTasks()
    // this.submitFinalTaskList(this.props.address)
  }
  // let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
  async getProjectStatus () {
    this.setState(this.props.project)
  }

  async getTasks () {
    this.props.getTasks(this.props.address, this.props.project.state)
  }

  async submitFinalTaskList () {
    this.props.submitFinalTaskList(this.props.address)
    // this.props.submitFinalTaskList(this.props.address, {taskHash: this.props.project.topTaskHash})
    // await pr.stakedProjects(this.props.address).then(winner => {
    //   return winner
    // }).then((topTaskHash) => {
    //   // console.log(this.props.project.taskList)
    //   // console.log(this.props.project.topTaskHash)
    //   Object.keys(this.props.project.taskList).map(async (address, i) => {
    //     console.log(this.props.project.taskList, i)
    //     let hash = hashTasksArray(this.props.project.taskList, this.state.weiCost)
    //     if (hash === topTaskHash) {
    //       let list = hashTasks(this.props.project.taskList[address], this.state.weiCost)
    //       eth.getAccounts(async (err, accounts) => {
    //         if (!err) {
    //           await pr.submitFinalTaskList(this.props.address, list, {from: accounts[0]}).then(() => {
    //             this.props.submitFinalTaskList({taskList: this.props.project.taskList[address], address: this.props.address, listSubmitted: true})
    //           })
    //         }
    //       })
    //     } else {
    //       console.log(hash, topTaskHash)
    //       console.error('hash does not match topTaskHash')
    //     }
    //   })
    // })
  }

  async claimTask (i) {
    this.props.claimTask(this.props.address, i)
    // eth.getAccounts(async (err, accounts) => {
    //   if (!err) {
    //     // why are we hashing the description?
    //     let hash = web3.fromAscii(this.props.project.taskList[i].description, 32)
    //     await rr.claimTask(this.props.address, i, hash, this.props.project.taskList[i].percentage, {from: accounts[0]})
    //       .then(async () => {
    //         this.props.taskClaimed({address: this.props.address, index: i})
    //       })
    //   }
    // })
  }

  submitTaskComplete (i) {
    this.props.submitTaskComplete(this.props.address, i)
    // eth.getAccounts(async (err, accounts) => {
    //   if (!err) {
    //     await pr.submitTaskComplete(this.props.address, i, {from: accounts[0]})
    //       .then(async () => {
    //         this.props.taskCompleted({address: this.props.address, index: i})
    //       })
    //   }
    // })
  }

  checkValidateStatus () {
    this.props.checkValidateStatus(this.props.address)
  }

  render () {
    // let taskList = JSON.parse(this.props.project.taskList)
    let tasks
    if (this.props.project.taskList !== null) {
      let reputationCost = this.props.project.reputationCost
      let weiCost = this.props.project.weiCost
      tasks = JSON.parse(this.props.project.taskList).map((task, i) => {
        let weiReward = Math.floor(weiCost * task.percentage / 100)
        // console.log(!this.props.project.listSubmitted || (typeof this.props.tasks !== 'undefined' && this.props.tasks[i].claimed))
        // console.log(!this.props.project.listSubmitted && !this.props.tasks[i].claimed && this.props.tasks[i].complete)
        // console.log('test', this.props.project.listSubmitted, this.props.tasks[i].claimed, this.props.tasks[i].complete)
        if (typeof this.props.tasks !== 'undefined') {
          return {
            key: i,
            // description loads incorrectly, we need a way to reference the description key in the string
            description: `${this.props.project.taskList}`,
            ethReward: `${web3.fromWei(weiReward, 'ether')} ETH`,
            repClaim: typeof reputationCost !== 'undefined' && typeof weiCost !== 'undefined' && typeof weiReward !== 'undefined' ? `${Math.floor(reputationCost * weiReward / weiCost)} rep` : '',
            buttons: <ButtonGroup>
              <Button
                disabled={!this.props.project.listSubmitted || this.props.tasks[i].claimed}
                type='danger' onClick={() => this.claimTask(i)}>Claim</Button>
              <Button
                disabled={!this.props.project.listSubmitted || !this.props.tasks[i].claimed || (this.props.tasks[i].claimed && this.props.tasks[i].complete)
                  // !(!this.props.project.listSubmitted || (!this.props.tasks[i].claimed && this.props.tasks[i].complete))
                }
                type='danger' onClick={() => this.submitTaskComplete(i)}>Task Complete</Button>
            </ButtonGroup>
          }
        } else {
          return {
            key: i,
            description: ``,
            ethReward: ``,
            repClaim: ``,
            buttons: <div />
          }
        }
      })
    } else {
      tasks = []
    }

    return (
      <ClaimComponent
        name={this.state.name}
        address={this.props.address}
        photo={this.state.photo}
        summary={this.state.summary}
        location={this.state.location}
        cost={web3.fromWei(this.state.weiCost, 'ether')}
        reputationCost={this.state.reputationCost}
        date={moment(this.state.nextDeadline)}
        tasks={tasks}
        listSubmitted={this.props.project.listSubmitted}
        submitFinalTaskList={this.submitFinalTaskList}
        claimTask={this.claimTask}
        checkValidateStatus={this.checkValidateStatus}
        // taskClaimed={this.taskClaimed}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[3][ownProps.address],
    tasks: state.projects[3][ownProps.address].tasks
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTasks: (address, state) => dispatch(getTasks(address, state))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimProject)
