import React from 'react'
import { connect } from 'react-redux'
import ClaimComponent from '../../components/project/3Claim'
import { Button } from 'antd'
import {eth, web3, rr, pr, P} from '../../utilities/blockchain'
import { hashTasksArray, hashTasks } from '../../utilities/hashing'
import { taskClaimed, taskListSubmitted, taskCompleted } from '../../actions/projectActions'
import moment from 'moment'
import ipfs from '../../utilities/ipfs'
const ButtonGroup = Button.Group

class ClaimProject extends React.Component {
  constructor () {
    super()
    this.state = {}
    this.getProjectStatus = this.getProjectStatus.bind(this)
    this.submitWinningHashList = this.submitWinningHashList.bind(this)
    this.checkValidation = this.checkValidation.bind(this)
  }

  componentWillMount () {
    this.getProjectStatus()
  }
// let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
  async getProjectStatus () {
    let accounts
    let p = P.at(this.props.address)
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        if (accounts.length) {
          let weiCost = (await p.weiCost()).toNumber()
          let reputationCost = (await p.reputationCost()).toNumber()
          let ipfsHash = web3.toAscii(await p.ipfsHash())
          let nextDeadline = (await p.nextDeadline()) * 1000
          let projectState = (await p.state())
          let projObj = {
            weiCost,
            reputationCost,
            ipfsHash,
            nextDeadline,
            state: projectState,
            project: p,
            taskList: this.props.project.taskList
          }
          ipfs.object.get(ipfsHash, (err, node) => {
            if (err) {
              throw err
            }
            let dataString = new TextDecoder('utf-8').decode(node.toJSON().data)
            projObj = Object.assign({}, projObj, JSON.parse(dataString))
            this.setState(projObj)
          })
        }
      }
    })
  }

  async submitWinningHashList () {
    await pr.stakedProjects(this.props.address).then(winner => {
      return winner
    }).then((topTaskHash) => {
      Object.keys(this.props.project.submittedTasks).map(async (address, i) => {
        let hash = hashTasksArray(this.props.project.submittedTasks[address], this.state.weiCost)
        if (hash === topTaskHash) {
          let list = hashTasks(this.props.project.submittedTasks[address], this.state.weiCost)
          eth.getAccounts(async (err, accounts) => {
            if (!err) {
              await pr.submitHashList(this.props.address, list, {from: accounts[0]}).then(() => {
                this.props.taskListSubmitted({taskList: this.props.project.submittedTasks[address], address: this.props.address, listSubmitted: true})
              })
            }
          })
        } else {
          console.log(hash, topTaskHash)
          console.error('hash does not match topTaskHash')
        }
      })
    })
  }

  claimTask (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        let hash = web3.fromAscii(this.props.project.taskList[i].description, 32)
        await rr.claimTask(this.props.address, i, hash, 100 * (this.props.project.taskList[i].weiReward / this.state.weiCost), {from: accounts[0]})
        .then(async() => {
          this.props.taskClaimed({address: this.props.address, index: i})
        })
      }
    })
  }

  markTaskComplete (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.submitTaskComplete(this.props.address, i, {from: accounts[0]})
        .then(async() => {
          this.props.taskCompleted({address: this.props.address, index: i})
        })
      }
    })
  }

  checkValidation () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.checkValidate(this.props.address, {from: accounts[0]})
      }
    })
  }

  render () {
    let tasks
    if (typeof this.props.project.taskList !== 'undefined') {
      tasks = this.props.project.taskList.map((task, i) => {
        let reputationCost = this.props.project.reputationCost
        let weiCost = this.props.project.weiCost
        return {
          key: i,
          description: task.description,
          ethReward: `${web3.fromWei(task.weiReward, 'ether')} ETH`,
          repClaim: typeof reputationCost !== 'undefined' && typeof weiCost !== 'undefined' && typeof task.weiReward !== 'undefined' ? reputationCost * task.weiReward / weiCost : '',
          buttons: <ButtonGroup>
            <Button
              disabled={this.props.project.taskList[i].claimed || !this.props.project.listSubmitted}
              type='danger' onClick={() => this.claimTask(i)}>Claim</Button>
            <Button
              disabled={this.props.project.taskList[i].submitted || !this.props.project.taskList[i].claimed || !this.props.project.listSubmitted}
              type='danger' onClick={() => this.markTaskComplete(i)}>Task Complete</Button>
          </ButtonGroup>
        }
      })
    } else {
      tasks = []
    }

    return (
      <ClaimComponent
        name={this.state.name}
        address={this.props.address}
        photo={this.state.photo}
        summary={this.state.summary}
        location={this.state.location}
        cost={web3.fromWei(this.state.cost, 'ether')}
        reputationCost={this.state.reputationCost}
        date={moment(this.state.nextDeadline)}
        tasks={tasks}
        listSubmitted={this.props.project.listSubmitted}
        submitWinningHashList={this.submitWinningHashList}
        checkValidation={this.checkValidation}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects.allProjects[ownProps.address]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    taskClaimed: (submissionDetails) => dispatch(taskClaimed(submissionDetails)),
    taskListSubmitted: (taskDetails) => dispatch(taskListSubmitted(taskDetails)),
    taskCompleted: (taskDetails) => dispatch(taskCompleted(taskDetails))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimProject)
