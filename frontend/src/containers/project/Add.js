import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Button } from 'antd'
import AddComponent from '../../components/project/Add'
import {eth, web3, pr, P} from '../../utilities/blockchain'
import hashing from '../../utilities/hashing'
import update from 'immutability-helper'
import { setProjectTaskList, setTaskSubmission } from '../../actions/projectActions'
import ipfsAPI from 'ipfs-api'
let ipfs = ipfsAPI()

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
          let nextDeadline = (await p.nextDeadline()) * 1000
          let weiCost = (await p.weiCost()).toNumber()
          let reputationCost = (await p.reputationCost()).toNumber()
          let ipfsHash = web3.toAscii(await p.ipfsHash())
          let projObj = {
            weiCost,
            reputationCost,
            ipfsHash
          }
          ipfs.object.get(ipfsHash, (err, node) => {
            if (err) {
              throw err
            }
            let dataString = new TextDecoder('utf-8').decode(node.toJSON().data)
            projObj = Object.assign({}, projObj, JSON.parse(dataString))
            this.setState({...projObj, nextDeadline, taskList: this.props.taskList})
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
      let totalProjectCost = web3.toWei(this.props.cost, 'ether')
      let taskArray = tasks.map(task => ({
        description: task.description,
        weiReward: task.percentage * totalProjectCost / 100
      }))
      let taskHash = this.hashTasksArray(taskArray)
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

  hashTasks (taskArray) {
    let taskHashArray = []
    let args = ['bytes32', 'uint']
    for (var i = 0; i < taskArray.length; i++) {
      let thisTask = []
      thisTask.push(web3.fromAscii(taskArray[i].description, 32))
      thisTask.push(100 * taskArray[i].weiReward / web3.toWei(this.props.cost, 'ether'))
      taskHashArray.push(hashing.keccakHashes(args, thisTask))
    }
    return taskHashArray
  }

  hashTasksArray (taskArray) {
    let hashList = this.hashTasks(taskArray)
    hashList.map(arr => arr.slice(2))
    let numArgs = hashList.length
    let args = 'bytes32'.concat(' bytes32'.repeat(numArgs - 1)).split(' ')
    let taskHash = hashing.keccakHashes(args, hashList)
    return taskHash
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

    let submissionTasks = []
    if (this.props.submissions) {
      submissionTasks = Object.keys(this.props.submissions).map((address, i) => {
        // pl.calculateWeightOfAddress(this.props.address, address).then(weight => {
        return {
          key: i,
          submitter: address,
          submission: JSON.stringify(this.props.submissions[address]),
          weighting: (<div style={{minWidth: 70}}>'tbd'</div>)
        }
        // })
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
      <AddComponent
        name={this.state.name}
        address={this.props.address}
        photo={this.state.photo}
        summary={this.state.summary}
        location={this.state.location}
        cost={web3.fromWei(this.state.cost, 'ether')}
        reputationCost={this.state.reputationCost}
        date={moment(this.state.nextDeadline)}
        submission={submission}
        tasks={tasks}
        submitTaskList={this.submitTaskList}
        checkActive={this.checkActive}
        submissionTasks={submissionTasks}
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
