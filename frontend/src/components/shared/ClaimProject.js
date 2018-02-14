import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
// import { Card, CardBody, CardTitle, CardText, Button, Col } from 'reactstrap'
import { Card, Button, Table } from 'antd'
import {eth, web3, dt, pr, P} from '../../utilities/blockchain'
import hashing from '../../utilities/hashing'
import * as _ from 'lodash'
import { setProjectTaskList } from '../../actions/projectActions'

const getProjectState = () => ({ type: 'GET_PROJECT_STATE' })

class ClaimProject extends React.Component {
  constructor () {
    super()
    this.state = {
      value: '',
      percentages: '',
      tasks: '',
      tempTaskList: {}
    }
    window.pr = pr
    this.handleTaskInput = this.handleTaskInput.bind(this)
  }

  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state.tempTaskList, {[type]: val})
      this.setState({tempTaskList: temp})
      // console.log('tempTaskList', this.state.tempTaskList)
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
          let nextDeadline
          p.nextDeadline().then(result => {
            // blockchain reports time in seconds, javascript in milliseconds
            nextDeadline = result.toNumber() * 1000
            // console.log(this.setState)
            // this.setState({nextDeadline: nextDeadline})
            // console.log('nextDeadline', nextDeadline)
          })
          .then(() => {
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
    this.setState({project: p})
  }

  getProjIndex () {
    return this.props.projects.projects.map((e) => { return e.address }).indexOf(this.props.address)
  }

  handleTaskInput () {
    // console.log(this.state)
    // get tasks and percentages
    let tasks = this.state.tempTaskList.tasks.split(', ')
    // console.log(tasks, typeof tasks)
    let percentages = this.state.tempTaskList.percentages.split(', ').map(Number)
    // console.log(percentages, typeof percentages)
    let totalProjectCost = web3.toWei(this.props.cost, 'ether')
    let taskweiReward = percentages.map(x => x * totalProjectCost / 100)
    let taskHash = this.hashTasksForAddition(tasks, taskweiReward)
    this.props.addTaskHash(taskHash)
    if (!_.isEmpty(this.state.tempTaskList)) {
      // make table object for task list
      let temp, thisIndex
      let projIndex = this.getProjIndex()
      if (typeof this.props.projects.projects[projIndex].taskList === 'undefined') {
        thisIndex = 0
        temp = []
      } else {
        temp = this.props.projects.projects[projIndex].taskList
        thisIndex = temp[temp.length - 1].index + 1
      }
      // console.log(temp)
      for (var i = 0; i < tasks.length; i++) {
        temp.push({
          index: thisIndex,
          tasks: tasks[i],
          taskweiReward: taskweiReward[i]
        })
        console.log(temp)
      }
      // console.log(temp)
      this.setState({tempTaskList: {}})
      this.props.setProjectTaskList({ address: this.props.address, taskList: temp })
      // console.log(this.state)
    }
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
    let d
    // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
    if (typeof this.state.nextDeadline !== 'undefined') { d = moment(this.state.nextDeadline) }
    // console.log(this.props.taskList)
    // console.log(this.state.nextDeadline)
    // console.log(this.props)
    let projIndex = this.getProjIndex()
    let taskList = this.props.projects.projects[projIndex].taskList
    let tasks
    if (typeof taskList !== 'undefined') {
      // console.log(taskList)
      tasks = taskList.map((task, i) => {
        // console.log(task)
        return {
          key: i,
          index: task.index,
          description: task.tasks,
          weiReward: task.taskweiReward
        }
      })
    } else {
      tasks = []
    }

    const columns = [{
      title: 'Submission Set',
      dataIndex: 'index',
      key: 'index'
    }, {
      title: 'Task Description',
      dataIndex: 'description',
      key: 'description'
    }, {
      title: 'Reward / Reputation',
      dataIndex: 'weiReward',
      key: 'weiReward'
    }]

    // take JSON this.props.taskList --> generate the rows of table
    // use {} and put that in

    return (
      // <Col sm='10'>
      <Card title={`${this.props.description}`} >
        <div style={{wordWrap: 'break-word'}}>{`${this.props.address}`}</div>
        <div>project funds: {`${this.props.cost}`} ETH</div>
        {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
        <div>
          <div>
            task submission expires {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}
          </div>
          <div>
            <input
              ref={(input) => (this.submitList = input)}
              placeholder='submission set'
              disabled
            />
            <Button disabled style={{marginLeft: 10}}>
              Submit Task Set
            </Button>
          </div>
        </div>
        <input
          ref={(input) => (this.tasks = input)}
          placeholder='task description'
          onChange={(e) => this.onChange('tasks', this.tasks.value)}
          value={this.state.tempTaskList.tasks || ''}
        />
        <input
          ref={(input) => (this.percentages = input)}
          style={{marginLeft: 10}}
          placeholder='% of project cost'
          onChange={(e) => this.onChange('percentages', this.percentages.value)}
          value={this.state.tempTaskList.percentages || ''}
        />
        <Button type='primary' onClick={() => this.handleTaskInput(this.state.tempTaskList)} style={{marginLeft: 10}}>
          Add Tasks
        </Button>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Table dataSource={tasks} columns={columns} />
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getProjectState, setProjectTaskList
  }, dispatch)
  // return {
  //   getProjectState: () => console.log('heyhey')
  // }
}
 // = ({cost, description, stakingEndDate, address, index, stakeProject, unstakeProject, stakingAmount}) => {

export default connect(mapStateToProps, mapDispatchToProps)(ClaimProject)
