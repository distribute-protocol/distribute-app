import React from 'react'
import { connect } from 'react-redux'
import VoteComponent from '../../components/project/Vote'
import { Button } from 'antd'
import {eth, pr, tr, web3, P, T} from '../../utilities/blockchain'
import moment from 'moment'
import ipfsAPI from 'ipfs-api'
let ipfs = ipfsAPI()

class VoteTasks extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: []
    }
    this.voteTask = this.voteTask.bind(this)
    this.checkEnd = this.checkEnd.bind(this)
  }

  componentWillMount () {
    this.getProjectStatus()
    this.props.project.taskList.map(async (task, i) => {
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
  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state, {[type]: val})
      this.setState(temp)
    } catch (error) {
      throw new Error(error)
    }
  }

  voteTask (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.voteCommit(this.props.address, i, 100, 'hash', 0, {from: accounts[0]})
          // .then(async() => {
          //
          // })
      }
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
    let tasks
    if (typeof this.props.project.taskList !== 'undefined') {
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
                type='danger' onClick={() => this.voteTask(i)}> Vote! </Button>
            </div>
        }

        return {
          key: i,
          description: this.props.project.taskList[i].description,
          ethReward: `${web3.fromWei(this.props.project.taskList[i].weiReward, 'ether')} ETH`,
          rewardValidator: rewardVal,
          rewardWorker: rewardWork,
          taskNeedsVote: needsVote
        }
      })
    } else {
      tasks = []
    }

    return (
      <VoteComponent
        name={this.state.name}
        address={this.props.address}
        photo={this.state.photo}
        summary={this.state.summary}
        location={this.state.location}
        cost={web3.fromWei(this.state.cost, 'ether')}
        reputationCost={this.state.reputationCost}
        date={moment(this.state.nextDeadline)}
        tasks={tasks}
        checkVoting={this.checkEnd}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects.allProjects[ownProps.address]
  }
}

export default connect(mapStateToProps)(VoteTasks)
