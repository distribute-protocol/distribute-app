import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Card, Button, Table } from 'antd'
import {eth, web3, rr, pr, pl, P} from '../../utilities/blockchain'
import hashing from '../../utilities/hashing'
import { setProjectTaskList, indicateTaskClaimed, indicateTaskListSubmitted, indicateTaskSubmitted } from '../../actions/projectActions'
const ButtonGroup = Button.Group

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
    window.hashing = hashing
  }

  claimElement (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        // console.log(100 * (this.props.taskList[i].weiReward / web3.toWei(this.props.cost, 'ether')))
        let hash = web3.fromAscii(this.props.taskList[i].description, 32)
        await rr.claimTask(this.props.address, i, hash, 100 * (this.props.taskList[i].weiReward / web3.toWei(this.props.cost, 'ether')), {from: accounts[0]})
        .then(async() => {
          this.props.indicateTaskClaimed({address: this.props.address, index: i})
        })
      }
    })
  }

  submitTask (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.submitTaskComplete(this.props.address, i, {from: accounts[0]})
        .then(async() => {
          this.props.indicateTaskSubmitted({address: this.props.address, index: i})
        })
      }
    })
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
            this.setState({nextDeadline: nextDeadline})
          }).then(() => {
            p.state().then(result => {
              let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
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
    window.p = p
    window.pl = pl
    this.getProjectStatus(p)
    this.setState({project: p, taskList: this.props.taskList})
  }

  handleTaskInput () {
    let task = this.state.tempTask.description
    let percentage = parseInt(this.state.tempTask.percentage, 10)
    let tempTask = this.state.taskList
    tempTask.push({description: task, percentage: percentage})
    this.props.setProjectTaskList({taskList: tempTask, address: this.props.address})
    this.setState({tempTask: {}})
  }

  async submitWinningHashList () {
    await pr.stakedProjects(this.props.address).then(winner => {
      return winner
    }).then((topTaskHash) => {
      Object.keys(this.props.submissions).map(async (address, i) => {
        let hash = this.hashTasksForAddition(this.props.submissions[address])
        if (hash === topTaskHash) {
          let list = this.hashListForSubmission(this.props.submissions[address])
          eth.getAccounts(async (err, accounts) => {
            if (!err) {
              await pr.submitHashList(this.props.address, list, {from: accounts[0]}).then(() => {
                this.props.indicateTaskListSubmitted({taskList: this.props.submissions[address], address: this.props.address, listSubmitted: true})
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
    // task, weighting
    let args = ['bytes32', 'uint']
    for (var i = 0; i < taskArray.length; i++) {
      let thisTask = []
      thisTask.push(web3.fromAscii(taskArray[i].description, 32))
      thisTask.push(100 * taskArray[i].weiReward / web3.toWei(this.props.cost, 'ether'))
      taskHashArray.push(hashing.keccakHashes(args, thisTask))
      // console.log(hashing.keccakHashes(args, thisTask))
      // console.log(taskArray[i].description)
      // console.log(100 * taskArray[i].weiReward / web3.toWei(this.props.cost, 'ether'))
    }
    return taskHashArray
  }

  checkValidation () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.checkValidate(this.props.address, {from: accounts[0]}).then((res) => {
          window.heyhey = res
        })
      }
    })
  }

  render () {
    // console.log(this.props.taskList)
    let d
    if (typeof this.state.nextDeadline !== 'undefined') { d = moment(this.state.nextDeadline) }
    let tasks
    if (typeof this.props.taskList !== 'undefined') {
      tasks = this.props.taskList.map((task, i) => {
        let weiReward
        console.log(task.weiReward)
        typeof task.weiReward !== 'undefined'
         ? weiReward = task.weiReward + ' wei'
         : weiReward = ''
        let reputationCost = this.props.projects[this.props.address].reputationCost
        let weiCost = this.props.projects[this.props.address].weiCost
        // console.log(reputationCost, weiCost)
        return {
          key: i,
          description: task.description,
          ethReward: weiReward,
          repClaim: typeof reputationCost !== 'undefined' && typeof weiCost !== 'undefined' && typeof taskWeiReward !== 'undefined' ? reputationCost * task.weiReward / weiCost : '',
          buttons: <ButtonGroup>
            <Button
              disabled={this.props.taskList[i].claimed || !this.props.projects[this.props.address].listSubmitted}
              type='danger' onClick={() => this.claimElement(i)} >Claim</Button>,
            <Button
              disabled={this.props.taskList[i].submitted || !this.props.taskList[i].claimed || !this.props.projects[this.props.address].listSubmitted}
              type='danger' onClick={() => this.submitTask(i)} >Task Complete</Button>
          </ButtonGroup>
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
      title: 'Rep to Claim',
      dataIndex: 'repClaim',
      key: 'repClaim'
    }, {
      title: '',
      dataIndex: 'buttons',
      key: 'buttons'
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
        <Button
          disabled={this.props.projects[this.props.address].listSubmitted}
          onClick={() => this.submitWinningHashList()}>
            Submit Winning Hash List</Button>
        <Button
          onClick={() => this.checkValidation()}>
            Check Validate</Button>
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
    indicateTaskListSubmitted: (taskDetails) => dispatch(indicateTaskListSubmitted(taskDetails)),
    indicateTaskSubmitted: (taskDetails) => dispatch(indicateTaskSubmitted(taskDetails))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimProject)
