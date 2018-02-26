import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { Card, Button, Table } from 'antd'
import {eth, web3, dt, rr, pr, P} from '../../utilities/blockchain'
import hashing from '../../utilities/hashing'
import * as _ from 'lodash'
import { setProjectTaskList, indicateTaskClaimed, indicateTaskListSubmitted } from '../../actions/projectActions'

class ClaimProject extends React.Component {
  constructor () {
    super()
    this.state = {
      value: '',
      percentages: '',
      tasks: '',
      tempTask: {},
      taskList: [],
      isSubmitted: false
    }
    window.pr = pr
    window.state = this.state
  }

  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state.tempTask, {[type]: val})
      this.setState({tempTask: temp})
    } catch (error) {
      throw new Error(error)
    }
  }

  claimElement (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        // THIS WORKS
        console.log(this.props.taskList[i].description, this.props.taskList[i].weiReward)
        let hashMe = [{description: this.props.taskList[i].description, weiReward: this.props.taskList[i].weiReward}]
        console.log(this.hashListForSubmission(hashMe))
        await rr.claimTask(this.props.address, i, this.props.taskList[i].description, this.props.taskList[i].weiReward, '0', {from: accounts[0]})
        let realHash = await pr.tempHash()
        console.log(realHash, 'real Hash')
        // .then(() => {
        //   // this.props.indicateTaskClaimed({address: this.props.address, index: i})
        // })
      }
    })
  }

  /*
  function claimTask(address _projectAddress, uint256 _index, string _taskDescription, uint256 _weiVal, uint256 _reputationVal) public {
    require(balances[msg.sender] >= _reputationVal);
    balances[msg.sender] -= _reputationVal;
    totalFreeSupply -= _reputationVal;
    projectRegistry.claimTask(_projectAddress, _index, _taskDescription, _weiVal, _reputationVal, msg.sender);
  }
  */

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
            this.setState({nextDeadline: nextDeadline})
          }).then(() => {
            p.state().then(result => {
              let states = ['none', 'proposed', 'none', 'dispute', 'active', 'validation', 'voting']
              projectState = states[result]
              this.setState({projectState: projectState})
            })
          })
        }
      }
    })
  }

  componentWillMount () {
    let p = P.at(this.props.address)
    this.getProjectStatus(p)
    // console.log(this.state.projectState)
    this.setState({project: p, taskList: this.props.taskList})
  }

  handleTaskInput () {
    let task = this.state.tempTask.description
    let percentage = parseInt(this.state.tempTask.percentage)
    let tempTask = this.state.taskList
    tempTask.push({description: task, percentage: percentage})
    this.props.setProjectTaskList({taskList: tempTask, address: this.props.address})
    this.setState({tempTask: {}})
  }

  async submitWinningHashList () {
    await pr.disputedProjects(this.props.address).then(winner => {
      console.log('top task hash', winner)
      return winner
    }).then((topTaskHash) => {
      // console.log('made it here')
      Object.keys(this.props.submissions).map(async (address, i) => {
        console.log('current submission', this.props.submissions[address])
        let hash = this.hashTasksForAddition(this.props.submissions[address])
        console.log('hash of current submission', hash)
        if (hash === topTaskHash) {
          let list = this.hashListForSubmission(this.props.submissions[address])
          console.log('list', list)
          eth.getAccounts(async (err, accounts) => {
            if (!err) {
              console.log(accounts)
              await pr.submitHashList(this.props.address, list, {from: accounts[0]}).then(() => {
                this.props.indicateTaskListSubmitted({taskList: this.props.submissions[address], address: this.props.address, listSubmitted: true})
                console.log('set project task list', this.props.projects)
              })
            }
          })
        }
      })
    })
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
      thisTask.push('0')
      // console.log(thisTask)
      taskHashArray.push(hashing.keccakHashes(args, thisTask))
    }
    return taskHashArray
  }

  render () {
    // console.log(this.props.taskList)
    let d
    if (typeof this.state.nextDeadline !== 'undefined') { d = moment(this.state.nextDeadline) }
    let tasks
    if (typeof this.props.taskList !== 'undefined') {
      tasks = this.props.taskList.map((task, i) => {
        return {
          key: i,
          description: task.description,
          ethReward: this.props.cost * (task.weiReward / 100) + ' ETH',
          addTask: <Button
          disabled={this.props.taskList[i].claimed}
          type='danger' onClick={() => this.claimElement(i)} > Claim</Button>
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
      title: 'ETH Reward',
      dataIndex: 'ethReward',
      key: 'ethReward'
    }, {
      title: '',
      dataIndex: 'addTask',
      key: 'addTask'
    }]

    return (
      // <Col sm='10'>
      <Card title={`${this.props.description}`} >
        <div style={{wordWrap: 'break-word'}}>{`${this.props.address}`}</div>
        <div>project funds: {`${this.props.cost}`} ETH</div>
        <div>project state: <strong>{`${this.state.projectState}`}</strong></div>
        {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
        <div>
          <div>
            task completion expires {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Table dataSource={tasks} columns={columns} />
        </div>
        <Button disabled={this.props.projects[this.props.address].listSubmitted} onClick={() => this.submitWinningHashList()}>Submit Winning Hash List</Button>
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
    indicateTaskClaimed: (submissionDetails) => dispatch(indicateTaskClaimed(submissionDetails)),
    indicateTaskListSubmitted: (taskDetails) => dispatch(indicateTaskListSubmitted(taskDetails))
  }

  // return {
  //   getProjectState: () => console.log('heyhey')
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimProject)
