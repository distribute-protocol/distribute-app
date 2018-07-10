/* global alert */
import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import AddComponent from '../../components/project/2Add'
import {eth, web3, pl} from '../../utilities/blockchain'
import { hashTasksArray } from '../../utilities/hashing'
import update from 'immutability-helper'
import moment from 'moment'
import * as _ from 'lodash'

class AddProject extends React.Component {
  constructor () {
    super()
    this.state = {
      tempTask: {},
      taskList: []
    }
    // this.getProjectStatus = this.getProjectStatus.bind(this)
    this.handleTaskInput = this.handleTaskInput.bind(this)
    this.submitTaskList = this.submitHashedTaskList.bind(this)
    this.moveRow = this.moveRow.bind(this)
    this.checkActive = this.checkActive.bind(this)
  }

  componentWillMount () {
    // this.getProjectStatus()
    this.props.getVerifiedTaskLists(this.props.address)
    let submissionTasks
    const projAddr = this.props.address
    function submissionWeighting (address) {
      return new Promise(async (resolve, reject) => {
        let weighting = await pl.calculateWeightOfAddress(projAddr, address)
        resolve(weighting)
      })
    }
    console.log(this.props.submissions, 'goobachev')
    if (this.props.submissions) {
      console.log(this.props.submissions, 'goobi')
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
  // getProjectStatus () {
  //   let projectObj = Object.assign({}, this.props.project, {taskList: this.props.taskList})
  //   this.setState(projectObj)
  // }

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
    this.props.setTaskList({taskList: newState.taskList, address: this.props.address})
    this.setState(newState)
  }

  deleteElement (i) {
    try {
      let newTaskList = JSON.parse(this.props.taskList)
      newTaskList.splice(i, 1)
      this.props.setTaskList({taskList: newTaskList}, this.props.address)
    } catch (error) {
      throw new Error(error)
    }
  }

  handleTaskInput () {
    let description = this.state.tempTask.description
    let percentage = parseInt(this.state.tempTask.percentage, 10)
    let tempTaskList = this.props.taskList.length === 0 ? [] : JSON.parse(this.props.taskList)
    tempTaskList.push({description, percentage})
    this.props.setTaskList({taskList: tempTaskList}, this.props.address)
    this.setState({tempTask: {}})
  }

  submitHashedTaskList () {
    let tasks = JSON.parse(this.props.taskList)
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
      this.props.submitHashedTaskList(tasks, taskHash, this.props.address)
    }
  }

  checkActive () {
    this.props.checkActiveStatus()
  }

  render () {
    let tasks
    console.log(this.props.tests)
    window.taskList = this.props.taskList
    window.submissions = this.props.submissions
    if (typeof this.props.taskList !== 'undefined' && this.props.taskList.length !== 0) {
      tasks = JSON.parse(this.props.taskList).map((task, i) => {
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
    tests: state.projects[2][ownProps.address],
    taskList: state.projects[2][ownProps.address].taskList,
    submissions: state.projects[2][ownProps.address].submittedTasks
  }
}

export default connect(mapStateToProps)(AddProject)
