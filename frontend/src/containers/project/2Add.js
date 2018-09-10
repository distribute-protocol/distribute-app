import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import AddComponent from '../../components/project/2Add'
import {web3} from '../../utilities/blockchain'
import update from 'immutability-helper'
import moment from 'moment'
import { setTaskList, getVerifiedTaskLists } from '../../actions/projectActions'

class AddProject extends React.Component {
  constructor () {
    super()
    this.state = {
      tempTask: {},
      taskList: []
    }
    this.handleTaskInput = this.handleTaskInput.bind(this)
    this.moveRow = this.moveRow.bind(this)
  }

  componentWillMount () {
    this.props.getVerifiedTaskLists(this.props.address)
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

  render () {
    let tasks, verifiedSubmissions
    if (this.props.taskList !== null && this.props.taskList.length !== 0) {
      tasks = JSON.parse(this.props.taskList).map((task, i) => {
        let ethReward = web3.fromWei(Math.ceil(this.props.project.weiCost / 1.05) * (task.percentage / 100), 'ether')
        return {
          key: i,
          description: task.description,
          percentage: `${task.percentage}%`,
          ethReward: `${ethReward.toFixed(5)} ETH`,
          usdReward: `$${parseFloat(this.props.ethPrice * ethReward).toFixed(2)}`,
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
        cost={web3.fromWei(Math.ceil(this.props.project.weiCost / 1.05), 'ether')}
        reputationCost={this.props.project.reputationCost}
        date={moment(this.props.project.nextDeadline)}
        tasks={tasks}
        submission={submission}
        submissionTasks={verifiedSubmissions}
        moveRow={this.moveRow}
        user={this.props.user}
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

const mapDispatchToProps = (dispatch) => {
  return {
    setTaskList: (taskDetails, projectAddress) => dispatch(setTaskList(taskDetails, projectAddress)),
    getVerifiedTaskLists: (projectAddress) => dispatch(getVerifiedTaskLists(projectAddress))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProject)
