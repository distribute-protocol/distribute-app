import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Card, Button, Table } from 'antd'
import {eth, pr, tr, P, T} from '../../utilities/blockchain'
import hashing from '../../utilities/hashing'
import { setProjectTaskList, indicateTaskClaimed, indicateTaskListSubmitted, indicateTaskSubmitted } from '../../actions/projectActions'

class VoteTasks extends React.Component {
  constructor () {
    super()
    this.state = {
      value: '',
      percentages: '',
      tasks: '',
      tempTask: {},
      taskList: [],
      isSubmitted: false,
      totalYes: 0,
      totalNo: 0
    }
    window.pr = pr
    window.hashing = hashing
    this.processTasks = this.processTasks.bind(this)
  }

  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state, {[type]: val})
      this.setState(temp)
    } catch (error) {
      throw new Error(error)
    }
  }

  validateTask (val, index, status) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.validateTask(this.props.address, index, val, status, {from: accounts[0]})
        .then(async(res) => {
          return res
          // this.props.indicateTaskClaimed({address: this.props.address, index: i})
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
    this.getProjectStatus(p)
    this.setState({project: p, taskList: this.props.taskList})
  }

  checkEnd () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.checkEnd(this.props.address, {from: accounts[0]}).then((res) => {
          return res
        })
      }
    })
  }
  processTasks () {
    let tasks = this.props.taskList.map(async (task, i) => {
      let weiReward
      typeof task.weiReward !== 'undefined'
       ? weiReward = task.weiReward + ' wei'
       : weiReward = ''
      let p = P.at(this.props.address)
      let taskAddress = await p.tasks(i)
      let taskContract = await T.at(taskAddress)
      let claimable = await taskContract.claimable()
      if (!claimable) {
        return {
          key: i,
          description: task.description,
          ethReward: weiReward,
          yesVal: (
            <div>
              <Button
                disabled={this.props.taskList[i].submitted || !this.props.taskList[i].claimed || !this.props.projects[this.props.address].listSubmitted}
                type='danger' onClick={() => this.validateTask(this.state.totalYes, i, true)} >Yes</Button>
              <input
                ref={(input) => (this.totalYes = input)}
                placeholder='Tokens'
                onChange={(e) => this.onChange('totalYes', this.totalYes.value)}
                value={this.state.totalYes || ''}
              />
            </div>
          ),
          noVal: (
            <div>
              <Button
                disabled={this.props.taskList[i].submitted || !this.props.taskList[i].claimed || !this.props.projects[this.props.address].listSubmitted}
                type='danger' onClick={() => this.validateTask(this.state.totalNo, i, false)}>No</Button>
              <input
                ref={(input) => (this.totalNo = input)}
                placeholder='Tokens'
                onChange={(e) => this.onChange('totalNo', this.totalNo.value)}
                value={this.state.totalNo || ''}
              />
            </div>
          )
        }
      }
      // p.tasks(i).then(val => T.at(val).then(con => con.claimable().then(val2 => {
      //   if (!val2) {

      // })))
       // let contract = T.at(val)
       // console.log('hey', contract.weighting())
       // let val = p.tasks(i).then(r => T.at(r).then(val => console.log(val.claimable))))
    })
    return tasks
  }

  render () {
    let d
    if (typeof this.state.nextDeadline !== 'undefined') { d = moment(this.state.nextDeadline) }
    let tasks
    if (typeof this.props.taskList !== 'undefined') {
      tasks = this.processTasks()
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
      dataIndex: 'yesVal',
      key: 'yesVal'
    }, {
      title: '',
      dataIndex: 'noVal',
      key: 'noVal'
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
          onClick={() => this.checkEnd()}
        >
          Check End
        </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(VoteTasks)
