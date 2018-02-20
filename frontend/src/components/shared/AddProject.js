import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
// import { Card, CardBody, CardTitle, CardText, Button, Col } from 'reactstrap'
import { Card, Button, Table } from 'antd'
import {eth, web3, dt, tr, pr, P} from '../../utilities/blockchain'
import hashing from '../../utilities/hashing'
import * as _ from 'lodash'
import { setProjectTaskList } from '../../actions/projectActions'

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
  }

  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state.tempTask, {[type]: val})
      this.setState({tempTask: temp})
      // console.log(type, val)
      // console.log('tempTask', this.state.tempTask)
    } catch (error) {
      throw new Error(error)
    }
  }

  deleteElement (i) {
    try {
      let newTaskList = this.state.taskList
      newTaskList.splice(i, 1)
      this.props.setProjectTaskList({taskList: newTaskList, address: this.props.address})
    } catch (error) {
      throw new Error(error)
    }
  }

  getProjectStatus (p) {
    let accounts
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        // console.log('accounts', accounts)
        if (accounts.length) {
          let nextDeadline, projectState
          p.nextDeadline().then(result => {
            // blockchain reports time in seconds, javascript in milliseconds
            nextDeadline = result.toNumber() * 1000
            this.setState({nextDeadline: nextDeadline})
          }).then(() => {
            p.state().then(result => {
              let states = ['none', 'proposed', 'none', 'dispute', 'active', 'validation', 'voting']
              projectState = states[result]
              this.setState({projectState: projectState})
            })
            // pr.projectTaskList.call(this.props.address).then(result => {
            //   console.log(result)
            //   // taskHashes = result.toNumber()
            //   // console.log('taskHashes', taskHashes)
            //   // this.setState({
            //   //   nextDeadline,
            //   //   taskHashes
            // })
            // console.log('state', this.state)
            // })
          })
        }
      }
    })
  }

  componentWillMount () {
    // let p = P.at(this.props.address)
    let p = P.at(this.props.address)
    // console.log(p, this.props.address)
    this.getProjectStatus(p)
    this.setState({project: p, taskList: this.props.taskList})
  }

  // getProjIndex () {
  //   return this.props.projects.projects.map((e) => { return e.address }).indexOf(this.props.address)
  // }

  handleTaskInput () {
    // console.log(this.state)
    // get tasks and percentages
    let task = this.state.tempTask.description
    // console.log(tasks, typeof tasks)
    let percentage = parseInt(this.state.tempTask.percentage)
    // let sum = percentages.reduce((x, y) => x + y)
    // if (sum !== 100 || tasks.length !== percentages.length) {
    //   alert('PERCENTAGES MUST ADD UP TO 100, AND EACH TASK MUST HAVE AN ASSOCIATED PERCENTAGE')
    // } else {
    let totalProjectCost = web3.toWei(this.props.cost, 'ether')
    // let taskweiReward = percentage * totalProjectCost / 100
    // console.log(this.props.taskList)
    // console.log(this.state.tempTask)
    let tempTask = this.state.taskList
    tempTask.push({description: task, percentage: percentage})
    this.props.setProjectTaskList({taskList: tempTask, address: this.props.address})
    // let taskHash = this.hashTasksForAddition(tasks, taskweiReward)
      // eth.getAccounts(async (err, accounts) => {
      //   if (!err) {
          // console.log(this.props.address)
          // console.log(taskHash)
          // await pr.addTaskHash(this.props.address, taskHash, {from: accounts[0]}).then(() => {
      // if (!_.isEmpty(this.state.tempTask)) {
      // // make table object for task list
      //         // let temp, thisIndex
      //         // console.log(this.props.projects.projects)
      //         // if (typeof this.props.projects.projects[projIndex].taskList === 'undefined') {
      //         //   thisIndex = 0
      //         //   temp = []
      //         // } else {
      //         //   temp = this.props.projects.projects[projIndex].taskList
      //         //   thisIndex = temp[temp.length - 1].index + 1
      //         // }
      //         // // console.log(temp)
      //         // for (var i = 0; i < tasks.length; i++) {
      //         //   temp.push({
      //         //     index: thisIndex,
      //         //     tasks: tasks[i],
      //         //     taskweiReward: taskweiReward[i]
      //         //   })
      //         //   // console.log(temp)
      //         // }
      //         // // console.log(temp)
      //         this.setState({tempTask: {}})
      //         this.props.setProjectTaskList({ address: this.props.address, taskList: temp })
      //       }
      //   //   })
      //   }
      // })
    // }
  }

  hashTasksForAddition (tasks, weiReward) {
    let hashList = this.hashListForSubmission(tasks, weiReward)
    hashList.map(arr => arr.slice(2))
    let numArgs = hashList.length
    let args = 'bytes32'.concat(' bytes32'.repeat(numArgs - 1)).split(' ')
    let taskHash = hashing.keccakHashes(args, hashList)
    // console.log('final taskHash', '0x' + taskHash)
    return '0x' + taskHash
  }

  hashListForSubmission (tasks, weiReward) {
    let taskHashArray = []
    // define reputation reward from wei reward right now
    let repReward = weiReward
    // task, weiReward, repReward
    let args = ['bytes32', 'bytes32', 'bytes32']
    for (var i = 0; i < tasks.length; i++) {
      let thisTask = []
      thisTask.push(tasks[i])
      thisTask.push(weiReward[i])
      thisTask.push(repReward[i])  // build task description, weiReward, repReward
      // console.log(thisTask)
      taskHashArray.push('0x' + hashing.keccakHashes(args, thisTask))
    }
    // console.log('taskHashArray', taskHashArray)
    return taskHashArray
  }

  render () {
    // console.log(this.state.taskList)
    // console.log(this.state.tempTask)
    let d
    // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
    if (typeof this.state.nextDeadline !== 'undefined') { d = moment(this.state.nextDeadline) }
    // console.log(this.state.nextDeadline)
    // let projIndex = this.getProjIndex()
    // let taskList = this.props.projects.projects[projIndex].taskList
    let tasks
    // if (typeof taskList !== 'undefined') {
    // console.log(this.props.taskList)
    if (typeof this.props.taskList !== 'undefined') {
      tasks = this.props.taskList.map((task, i) => {
        // console.log(task)
        return {
          key: i,
          description: task.description,
          percentage: task.percentage + '%',
          ethReward: this.props.cost * (task.percentage / 100) + ' ETH',
          addTask: <Button type='danger' onClick={() => this.deleteElement(i)} > Delete</Button>
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
      dataIndex: 'addTask',
      key: 'addTask'
    }]

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

    // let submission
    // if (this.state.projectState === 'open' || this.state.projectState === 'dispute') {
    //   submission =
    //     <div>
    //       <input
    //         ref={(input) => (this.tasks = input)}
    //         placeholder='task description'
    //         onChange={(e) => this.onChange('tasks', this.tasks.value)}
    //         value={this.state.tempTask.tasks || ''}
    //       />
    //       <input
    //         ref={(input) => (this.percentages = input)}
    //         style={{marginLeft: 10}}
    //         placeholder='% of project cost'
    //         onChange={(e) => this.onChange('percentages', this.percentages.value)}
    //         value={this.state.tempTask.percentages || ''}
    //       />
    //       <Button type='primary' onClick={() => this.handleTaskInput(this.state.tempTask)} style={{marginLeft: 10}}>
    //         Add Tasks
    //       </Button>
    //     </div>
    // } else {
    //   submission =
    //     <div>
    //       <input
    //         ref={(input) => (this.submitList = input)}
    //         placeholder='submission set'
    //       />
    //       <Button style={{marginLeft: 10}}>
    //         Submit Task Set
    //       </Button>
    //     </div>
    // }

    // take JSON this.props.taskList --> generate the rows of table
    // use {} and put that in

    return (
      // <Col sm='10'>
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
          <Table dataSource={tasks} columns={columns} />
        </div>
        <div>
          <Button>Submit Remaining Tasks</Button>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log(state.projects.allProjects[ownProps.address])
  return {
    projects: state.projects.allProjects,
    taskList: state.projects.allProjects[ownProps.address].taskList
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setProjectTaskList: (taskDetails) => dispatch(setProjectTaskList(taskDetails)),
    getProjectState: () => dispatch(getProjectState())
  }

  // return {
  //   getProjectState: () => console.log('heyhey')
  // }
}
 // = ({cost, description, stakingEndDate, address, index, stakeProject, unstakeProject, stakingAmount}) => {

export default connect(mapStateToProps, mapDispatchToProps)(AddProject)
