import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import AddComponent from '../../components/project/2Add'
import {eth, web3, pr, pl, P} from '../../utilities/blockchain'
import { hashTasksArray } from '../../utilities/hashing'
import update from 'immutability-helper'
import { setProjectTaskList, setTaskSubmission } from '../../actions/projectActions'
import moment from 'moment'
import * as _ from 'lodash'
import ipfs from '../../utilities/ipfs'

class AddProject extends React.Component {
  constructor () {
    super()
    this.state = {
      tempTask: {},
      taskList: []
    }
    this.getProjectStatus = this.getProjectStatus.bind(this)
    this.handleTaskInput = this.handleTaskInput.bind(this)
    this.submitTaskList = this.submitTaskList.bind(this)
    this.moveRow = this.moveRow.bind(this)
    this.checkActive = this.checkActive.bind(this)
  }

  componentWillMount () {
    this.getProjectStatus()
    let submissionTasks
    const projAddr = this.props.address
    function submissionWeighting (address) {
      return new Promise(async (resolve, reject) => {
        let weighting = await pl.calculateWeightOfAddress(projAddr, address)
        resolve(weighting)
      })
    }
    if (this.props.submissions) {
      let submissions = Object.keys(this.props.submissions).map((address, i) => {
        return submissionWeighting(address)
          .then(async (weighting) => {
            return {
              key: i,
              submitter: address,
              submission: JSON.stringify(this.props.submissions[address]),
              weighting: (<div style={{minWidth: 70}}>{weighting.toNumber()}</div>)
            }
          })
      })

      Promise.all(submissions)
        .then(results => {
          submissionTasks = _.compact(results)
          this.setState({taskList: this.props.taskList, submissionTasks: submissionTasks})
        })
        .catch(e => {
          console.error(e)
        })
    }
    this.setState({submissionTasks})
  }

  componentWillReceiveProps (np) {
    this.setState({taskList: np.taskList})
  }
  // let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
  async getProjectStatus () {
    let accounts
    let p = P.at(this.props.address)
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        if (accounts.length) {
          let weiCost = (await p.weiCost()).toNumber()
          let reputationCost = (await p.reputationCost()).toNumber()
          let ipfsHash = web3.toAscii(await p.ipfsHash())
          let nextDeadline = (await p.nextDeadline()) * 1000
          let projObj = {
            weiCost,
            reputationCost,
            ipfsHash,
            nextDeadline,
            project: p,
            taskList: this.props.taskList
          }
          ipfs.object.get(ipfsHash, (err, node) => {
            if (err) {
              throw err
            }
            let dataString = new TextDecoder('utf-8').decode(node.toJSON().data)
            projObj = Object.assign({}, projObj, JSON.parse(dataString))
            this.setState(projObj)
          })
        }
      }
    })
  }

  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state.tempTask, {[type]: val})
      this.setState({tempTask: temp})
    } catch (error) {
      throw new Error(error)
    }
  }

  moveRow (dragIndex, hoverIndex) {
    const { taskList } = this.state
    const dragRow = taskList[dragIndex]
    let newState = update(this.state, {
      taskList: {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
      }
    })
    this.props.setProjectTaskList({taskList: newState.taskList, address: this.props.address})
    this.setState(newState)
  }

  deleteElement (i) {
    try {
      let newTaskList = this.props.taskList
      newTaskList.splice(i, 1)
      this.props.setProjectTaskList({taskList: newTaskList, address: this.props.address})
    } catch (error) {
      throw new Error(error)
    }
  }

  handleTaskInput () {
    let task = this.state.tempTask.description
    let percentage = parseInt(this.state.tempTask.percentage, 10)
    let tempTaskList = this.state.taskList
    tempTaskList.push({description: task, percentage: percentage})
    this.props.setProjectTaskList({taskList: tempTaskList, address: this.props.address})
    this.setState({tempTask: {}})
  }

  submitTaskList () {
    let tasks = this.props.taskList
    let sumTotal = tasks.map(el => el.percentage).reduce((prev, curr) => {
      return prev + curr
    }, 0)
    if (sumTotal !== 100) {
      alert('percentages must add up to 100!')
    } else {
      let taskArray = tasks.map(task => ({
        description: task.description,
        weiReward: task.percentage * this.state.weiCost / 100
      }))
      let taskHash = hashTasksArray(taskArray, this.state.weiCost)
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          await pr.addTaskHash(this.props.address, taskHash, {from: accounts[0]}).then(() => {
            this.props.setTaskSubmission({
              address: this.props.address,
              submitter: accounts[0],
              taskSubmission: taskArray
            })
          })
        }
      })
    }
  }

  checkActive () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.checkActive(this.props.address, {from: accounts[0]})
      }
    })
  }

  render () {
    let tasks
    if (typeof this.props.taskList !== 'undefined') {
      tasks = this.props.taskList.map((task, i) => {
        return {
          key: i,
          description: task.description,
          percentage: task.percentage,
          ethReward: web3.fromWei(this.state.weiCost * (task.percentage / 100), 'ether'),
          deleteTask: <Button type='danger' onClick={() => this.deleteElement(i)} >Delete</Button>
        }
      })
    } else {
      tasks = []
    }
    let submission =
      <div>
        <input
          ref={(input) => (this.tasks = input)}
          placeholder='task description'
          onChange={(e) => this.onChange('description', this.tasks.value)}
          value={this.state.tempTask.description || ''}
        />
        <input
          ref={(input) => (this.percentages = input)}
          style={{marginLeft: 10}}
          placeholder='% of project cost'
          onChange={(e) => this.onChange('percentage', this.percentages.value)}
          value={this.state.tempTask.percentage || ''}
        />
        <Button type='primary' onClick={() => this.handleTaskInput()} style={{marginLeft: 10}}>
          Add Tasks
        </Button>
      </div>

    return (
      <AddComponent
        name={this.state.name}
        address={this.props.address}
        photo={this.state.photo}
        summary={this.state.summary}
        location={this.state.location}
        cost={web3.fromWei(this.state.cost, 'ether')}
        reputationCost={this.state.reputationCost}
        date={moment(this.state.nextDeadline)}
        tasks={tasks}
        submitTaskList={this.submitTaskList}
        checkActive={this.checkActive}
        submission={submission}
        submissionTasks={this.state.submissionTasks}
        moveRow={this.moveRow}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    taskList: state.projects.allProjects[ownProps.address].taskList,
    submissions: state.projects.allProjects[ownProps.address].submittedTasks
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setProjectTaskList: (taskDetails) => dispatch(setProjectTaskList(taskDetails)),
    setTaskSubmission: (submissionDetails) => dispatch(setTaskSubmission(submissionDetails))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProject)
