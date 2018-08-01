/* global alert */
import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import AddComponent from '../../components/project/2Add'
import {web3} from '../../utilities/blockchain'
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
    this.getVerifiedTaskLists = this.getVerifiedTaskLists.bind(this)
    this.handleTaskInput = this.handleTaskInput.bind(this)
    this.submitTaskList = this.submitTaskList.bind(this)
    this.moveRow = this.moveRow.bind(this)
    this.checkActive = this.checkActive.bind(this)
  }

  componentWillMount () {
    this.getVerifiedTaskLists(this.props.address)
  }

  getVerifiedTaskLists (address) {
    this.props.getVerifiedTaskLists(address)
  }

  componentWillReceiveProps (np) {
    if (np.taskList) {
      this.setState({taskList: JSON.parse(np.taskList)})
    }
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
    this.props.setTaskList({taskList: newState.taskList}, this.props.address)
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

  submitTaskList () {
    let tasks = JSON.parse(this.props.taskList)
    let sumTotal = tasks.map(el => el.percentage).reduce((prev, curr) => {
      return prev + curr
    }, 0)
    if (sumTotal !== 100) {
      alert('percentages must add up to 100!')
    } else {
      let taskArray = tasks.map(task => ({
        description: task.description,
        percentage: task.percentage
      }))
      let taskHash = hashTasksArray(taskArray)
      this.props.submitHashedTaskList(tasks, taskHash, this.props.address)
    }
  }

  checkActive () {
    this.props.checkActiveStatus(this.props.address)
  }

  render () {
    let tasks, verifiedSubmissions
    if (this.props.taskList !== null && this.props.taskList.length !== 0) {
      tasks = JSON.parse(this.props.taskList).map((task, i) => {
        return {
          key: i,
          description: task.description,
          percentage: task.percentage,
          ethReward: web3.fromWei(this.props.project.weiCost * (task.percentage / 100), 'ether'),
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

    if (typeof this.props.submissions !== 'undefined') {
      verifiedSubmissions = this.props.submissions.map((submission, i) => {
        return {
          key: i,
          submitter: submission.submitter,
          submission: submission.content,
          weighting: submission.weighting
        }
      })
    }
    return (
      <AddComponent
        name={this.props.project.name}
        address={this.props.address}
        photo={this.props.project.photo}
        summary={this.props.project.summary}
        location={this.props.project.location}
        cost={web3.fromWei(this.props.project.weiCost, 'ether')}
        reputationCost={this.props.project.reputationCost}
        date={moment(this.props.project.nextDeadline)}
        tasks={tasks}
        submitTaskList={this.submitTaskList}
        checkActive={this.checkActive}
        submission={submission}
        submissionTasks={verifiedSubmissions}
        moveRow={this.moveRow}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[2][ownProps.address],
    taskList: state.projects[2][ownProps.address].taskList,
    submissions: state.projects[2][ownProps.address].submittedTasks
  }
}

export default connect(mapStateToProps)(AddProject)
