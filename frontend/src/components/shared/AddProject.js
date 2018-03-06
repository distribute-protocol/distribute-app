import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { Card, Button, Table } from 'antd'
import DraggableTable from './DraggableTable'
import {eth, web3, dt, tr, pr, P} from '../../utilities/blockchain'
import hashing from '../../utilities/hashing'
import * as _ from 'lodash'
import update from 'immutability-helper';
import { setProjectTaskList, setTaskSubmission } from '../../actions/projectActions'

const getProjectState = () => ({ type: 'GET_PROJECT_STATE' })

class AddProject extends React.Component {
  constructor () {
    super()
    this.state = {
      value: '',
      percentages: '',
      tasks: '',
      tempTask: {},
      taskList: []
    }
    window.pr = pr
    this.handleTaskInput = this.handleTaskInput.bind(this)
    // this.testFunction = this.testFunction.bind(this)
  }

  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state.tempTask, {[type]: val})
      this.setState({tempTask: temp})
    } catch (error) {
      throw new Error(error)
    }
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
  submitTaskListToStore (submitterAddress, submission) {
    this.props.setTaskSubmission({address: this.props.address, submitter: submitterAddress, taskSubmission: submission})
  }

  submitTaskList () {
    let tasks = this.props.taskList
    let sumTotal = tasks.map(el => el.percentage).reduce((prev, curr) => {
      return prev + curr
    }, 0)
    if (sumTotal !== 100) {
       alert('percentages must add up to 100!')
    } else {
      let totalProjectCost = web3.toWei(this.props.cost, 'ether')
      let taskFormatting = tasks.map(task => ({
        description: task.description,
        weiReward: task.percentage * totalProjectCost / 100
      }))
      let taskHash = this.hashTasksForAddition(taskFormatting)
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          await pr.addTaskHash(this.props.address, taskHash, {from: accounts[0]}).then(() => {
            // console.log('submission', taskFormatting)
            this.submitTaskListToStore(accounts[0], taskFormatting)
          })
        }
      })
    }
  }

  finalizeTaskList () {
    let tasks = this.props.taskList
    let sumTotal = tasks.map(el => el.percentage).reduce((prev, curr) => {
      return prev + curr
    }, 0)
    if (sumTotal !== 100) {
       alert('percentages must add up to 100!')
    } else {
      let totalProjectCost = web3.toWei(this.props.cost, 'ether')
      let taskFormatting = tasks.map(task => ({
        description: task.description,
        weiReward: task.percentage * totalProjectCost / 100
      }))
      let taskHashArray = this.hashTasksForSubmission(taskFormatting)
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          await pr.submitHashList(this.props.address, taskHashArray, {from: accounts[0]}).then(() => {
            // console.log('submission', taskFormatting)
            // this.submitTaskListToStore(accounts[0], taskFormatting)
          })
        }
      })
    }
  }
  getProjectStatus (p) {
    let accounts
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        if (accounts.length) {
          let nextDeadline, projectState
          p.nextDeadline().then(result => {
            // blockchain reports time in seconds, javascript in milliseconds
            nextDeadline = result.toNumber() * 1000
            // this.setState({nextDeadline: nextDeadline})
          }).then(() => {
            p.state().then(result => {
              let states = ['none', 'proposed', 'none', 'dispute', 'active', 'validation', 'voting']
              projectState = states[result]
              this.setState({projectState, nextDeadline})
            })
          })
        }
      }
    })
  }

  handleTaskInput () {
     let task = this.state.tempTask.description
     let percentage = parseInt(this.state.tempTask.percentage)
     let tempTask = this.state.taskList
     tempTask.push({description: task, percentage: percentage})
     this.props.setProjectTaskList({taskList: tempTask, address: this.props.address})
     this.setState({tempTask: {}})
   }

  hashTasksForAddition (taskArray) {
    let hashList = this.hashListForSubmission(taskArray)
    hashList.map(arr => arr.slice(2))
    let numArgs = hashList.length
    let args = 'bytes32'.concat(' bytes32'.repeat(numArgs - 1)).split(' ')
    let taskHash = hashing.keccakHashes(args, hashList)
    return taskHash
  }

  hashListForSubmission (taskArray) {
    let taskHashArray = []
    // define reputation reward from wei reward right now
    // task, weiReward, repReward
    let args = ['string', 'uint', 'uint']
    for (var i = 0; i < taskArray.length; i++) {
      let thisTask = []
      thisTask.push(taskArray[i].description)
      thisTask.push(taskArray[i].weiReward)
      // submit 0 reputation for now
      thisTask.push(0)
      taskHashArray.push(hashing.keccakHashes(args, thisTask))
    }
    return taskHashArray
  }

  componentWillReceiveProps(np) {
    this.setState({taskList: np.taskList})
  }
  moveRow = (dragIndex, hoverIndex) => {
    const { taskList } = this.state;
    const dragRow = taskList[dragIndex];
    let newState = update(this.state, {
      taskList: {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
      },
    })
    this.props.setProjectTaskList({taskList: newState.taskList, address: this.props.address})
    this.setState(
      newState
    );
  }

  componentWillMount () {
    let p = P.at(this.props.address)
    this.getProjectStatus(p)
    // console.log(this.state.projectState)
    this.setState({project: p, taskList: this.props.taskList})
  }

  render () {
    console.log(this.props.taskList)
    let d
    if (typeof this.state.nextDeadline !== 'undefined') { d = moment(this.state.nextDeadline) }
    let tasks
    if (typeof this.props.taskList !== 'undefined') {
      tasks = this.props.taskList.map((task, i) => {
        return {
          key: i,
          description: task.description,
          percentage: task.percentage,
          ethReward: this.props.cost * (task.percentage / 100),
          deleteTask: <Button type='danger' onClick={() => this.deleteElement(i)} >Delete</Button>
        }
      })
    } else {
      tasks = []
    }

    const columns = [{
      title: 'Task Description',
      dataIndex: 'description',
      key: 'description'
    }, {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage'
    }, {
      title: 'ETH Reward',
      dataIndex: 'ethReward',
      key: 'ethReward'
    }, {
      title: '',
      dataIndex: 'deleteTask',
      key: 'deleteTask'
    }]
    const submissionColumns = [{
      title: 'Submitter',
      dataIndex: 'submitter',
      key: 'submitter'
    }, {
      title: 'Submission',
      dataIndex: 'submission',
      key: 'submission'
    }, {
      title: 'Weighting',
      dataIndex: 'weighting',
      key: 'weighting'
    }]
    let submissionTasks = []
    if (this.props.submissions) {
      submissionTasks = Object.keys(this.props.submissions).map((address, i) => {
        return {
          key: i,
          submitter: address,
          submission: JSON.stringify(this.props.submissions[address]),
          weighting: 'tbd'
        }
      })
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
      <Card title={`${this.props.description}`} >
        <div style={{wordWrap: 'break-word'}}>{`${this.props.address}`}</div>
        <div>project funds: {`${this.props.cost}`} ETH</div>
        <div>project state: <strong>{`${this.state.projectState}`}</strong></div>
        {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
        <div>
          <div>
            task submission expires {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}
          </div>
          {submission}
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <DraggableTable address={this.props.address} data={tasks} columns={columns} moveRow={this.moveRow} handleReorder={this.handleReorder} />
        </div>
        <div>
          <Button onClick={() => this.submitTaskList()}>Submit Task Hash</Button>
        </div>
        <div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Table dataSource={submissionTasks} columns={submissionColumns} />
          </div>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: state.projects.allProjects,
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
