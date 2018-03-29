import React from 'react'
import { connect } from 'react-redux'
import VoteComponent from '../../components/project/5Vote'
import { Button } from 'antd'
import {eth, pr, tr, rr, web3, P, T} from '../../utilities/blockchain'
import { voteCommitted, voteRevealed } from '../../actions/projectActions'
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

  onChange (e) {
    this.setState({[e.target.name]: e.target.value})
    console.log(e.target)
  }

  // Can Vote Commit...Vote Reveal is another beast, need to think about UI
  voteTask (i, type, status) {
    let secretHash = web3.fromAscii(status, 32)
    let prevPollID = 0
    console.log(i, type, status, this.state['tokVal' + i], this.state['repVal' + i])
    type === 'tokens'
      ? this.commitToken(i, secretHash, prevPollID)
      : this.commitReputation(i, secretHash, prevPollID)
  }

  commitToken (i, hash, prevPollID) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        // await tr.voteCommit(this.props.address, i, this.state['tokVal' + i], hash, prevPollID, {from: accounts[0]})
        await console.log('goobi')
      }
    })
  }

  commitReputation (i, hash, prevPollID) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        // await rr.voteCommit(this.props.address, i, this.state['repVal' + i], hash, prevPollID, {from: accounts[0]})
      }
    })
  }

  // Works - need to check all related state
  rewardValidator (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.rewardValidator(this.props.address, i, {from: accounts[0]})
      }
    })
  }

  // Doesn't work because project needs to be in complete state, instatiating a task doesn't seem to work
  rewardTask (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await rr.rewardTask(this.props.address, i, {from: accounts[0]})
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
                  type='danger' onClick={() => this.rewardValidator(i)}> Reward Yes Validator </Button>
              </div>
            rewardWork =
              <div>
                <Button
                  type='danger' onClick={() => this.rewardTask(i)}> Reward Task </Button>
              </div>
            needsVote = <div />
          } else {
            // validators can claim, task fails
            rewardVal =
              <div>
                <Button
                  type='danger' onClick={() => this.rewardValidator(i)}> Reward No Validator </Button>
              </div>
            rewardWork = <div>ineligible</div>
            needsVote = <div />
          }
        } else {
          // vote needs to happen
          rewardVal = <div>nope, not yet</div>
          rewardWork = <div>nope, not yet</div>
          needsVote =
            <div>
              <div>
                <input
                  name={'tokVal' + i}
                  placeholder='tokens'
                  onChange={(e) => this.onChange(e)}
                  value={this.state['tokVal' + i] || ''}
                />
                <Button
                  type='danger' onClick={() => this.voteTask(i, 'tokens', true)}> Yes
                </Button>
                <Button
                  type='danger' onClick={() => this.voteTask(i, 'tokens', false)}> No
                </Button>
              </div>
              <div>
                <input
                  name={'repVal' + i}
                  placeholder='reputation'
                  onChange={(e) => this.onChange(e)}
                  value={this.state['repVal' + i] || ''}
                />
                <Button
                  type='danger' onClick={() => this.voteTask(i, 'rep', true)}> Yes
                </Button>
                <Button
                  type='danger' onClick={() => this.voteTask(i, 'rep', false)}> No
                </Button>
              </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    voteCommitted: (voteDetails) => dispatch(voteCommitted(voteDetails)),
    voteRevealed: (voteDetails) => dispatch(voteCommitted(voteDetails))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoteTasks)
