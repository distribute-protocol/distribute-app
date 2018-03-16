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
      tasks: [],
      tempTask: {},
      taskList: [],
      isSubmitted: false
    }
    window.pr = pr
    window.hashing = hashing
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
    this.props.taskList.map(async (task, i) => {
      let claimable, claimableByRep
      let p = await P.at(this.props.address)
      let index = await p.tasks(i)
      let t = T.at(index)
      claimable = await t.claimable()
      claimableByRep = await t.claimableByRep()
      let stateTasks = this.state.tasks
      stateTasks[i] = {claimable, claimableByRep}
      this.setState({tasks: stateTasks})
    })
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

  render () {
    let d
    if (typeof this.state.nextDeadline !== 'undefined') { d = moment(this.state.nextDeadline) }
    let tasks
    if (typeof this.props.taskList !== 'undefined') {
      let rewardVal, rewardWork, needsVote
      tasks = this.state.tasks.map((task, i) => {
        if (this.state.tasks[i].claimable) {
          if (this.state.tasks[i].claimableByRep) {
            // validators and workers can claim
            rewardVal =
              <div>
                <Button
                  type='danger' onClick={() => console.log('reward validator')}> Reward Yes Validator </Button>
              </div>
            rewardWork =
              <div>
                <Button
                  type='danger' onClick={() => console.log('reward worker')}> Reward Worker </Button>
              </div>
            needsVote = <div>nope, never</div>
          } else {
            // validators can claim, task fails
            rewardVal =
              <div>
                <Button
                  type='danger' onClick={() => console.log('reward validator')}> Reward No Validator </Button>
              </div>
            rewardWork = <div>nope, never</div>
            needsVote = <div>nope, never</div>
          }
        } else {
          // vote needs to happen
          rewardVal = <div>nope, not yet</div>
          rewardWork = <div>nope, not yet</div>
          needsVote =
            <div>
              <Button
                type='danger' onClick={() => console.log('vote!')}> Vote! </Button>
            </div>
        }
        let weiReward
        typeof this.props.taskList[i].weiReward !== 'undefined'
         ? weiReward = this.props.taskList[i].weiReward + ' wei'
         : weiReward = ''

        return {
          key: i,
          description: this.props.taskList[i].description,
          ethReward: weiReward,
          rewardValidator: rewardVal,
          rewardWorker: rewardWork,
          taskNeedsVote: needsVote
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
      title: 'Reward Validator?',
      dataIndex: 'rewardValidator',
      key: 'rewardValidator'
    }, {
      title: 'Reward Worker?',
      dataIndex: 'rewardWorker',
      key: 'rewardWorker'
    }, {
      title: 'Task Needs Vote?',
      dataIndex: 'taskNeedsVote',
      key: 'taskNeedsVote'
    }]

    return (
      // <Col sm='10'>
      <Card title={`${typeof this.state.projectData !== 'undefined' ? this.state.projectData.name : 'N/A'}`} style={{backgroundColor: '#DDE4E5', marginTop: 30}} >
        <div style={{wordWrap: 'break-word'}}>{`${this.props.address}`}</div>
        <div>project funds: {`${this.props.cost}`} ETH</div>
        <div>project state: <strong>{`${this.state.projectState}`}</strong></div>
        {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
        <div>
          <div>
            task completion expires {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#DDD3AA', marginTop: 30}}>
          <Table dataSource={tasks} columns={columns} />
        </div>
        <Button
          onClick={() => this.checkEnd()}>
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
