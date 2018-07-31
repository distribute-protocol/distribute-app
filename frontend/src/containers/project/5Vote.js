import React from 'react'
import { connect } from 'react-redux'
import VoteComponent from '../../components/project/5Vote'
import { Button, Icon } from 'antd'
import {eth, pr, tr, rr, web3, P, T} from '../../utilities/blockchain'
import { getTasks } from '../../actions/taskActions'
import { voteCommitted, voteRevealed } from '../../actions/pollActions'
import moment from 'moment'
import { utils } from 'ethers'

class VoteTasks extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: [],
      votes: {}
    }
    this.voteTask = this.voteTask.bind(this)
    this.checkEnd = this.checkEnd.bind(this)
  }

  componentWillMount () {
    this.getProjectStatus()
    this.getTasks()
    // this.getProjectStatus()
    // this.props.project.taskList.map(async (task, i) => {
    //   let claimable, claimableByRep
    //   let p = await P.at(this.props.address)
    //   let index = await p.tasks(i)
    //   let t = T.at(index)
    //   claimable = await t.claimable()
    //   claimableByRep = await t.claimableByRep()
    //   let stateTasks = this.state.tasks
    //   stateTasks[i] = {claimable, claimableByRep}
    //   this.setState({tasks: stateTasks})
    // })
  }

  // let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
  async getProjectStatus () {
    this.setState(this.props.project)
  }

  async getTasks () {
    this.props.getTasks(this.props.address, 5)
  }

  onChange (e) {
    this.setState({[e.target.name]: e.target.value})
    console.log(e.target)
  }

  // Can Vote Commit...Vote Reveal is another beast, need to think about UI
  voteTask (i, type, status) {
    // let salt = Math.floor(Math.random() * Math.floor(10000)).toString()   // get random salt between 0 and 10000
    // convert status and salt to strings
    let salt = 10000
    // let salt = ethUtil.bufferToHex(ethUtil.setLengthLeft(10000, 32))
    status
      ? status = 1
      : status = 0
    // status = ethUtil.bufferToHex(ethUtil.setLengthLeft(status, 32))
    // console.log(status + salt)
    // this.props.storeVote(i, status, salt)
    let vote = {key: i, status, salt, revealed: false, rescued: false}
    this.setState({votes: Object.assign({}, this.state.votes, {[i]: vote})})

    let secretHash = utils.solidityKeccak256(['int', 'int'], [status, salt])
    // console.log(i, type, status, this.state['tokVal' + i], this.state['repVal' + i])
    // console.log(this.props.users)
    type === 'tokens'
      ? this.commitToken(i, secretHash, status, salt)
      : this.commitReputation(i, secretHash, status, salt)
  }

  revealTask (i, type, status) {
    // let salt = this.state.votes[i].salt
    // convert status and salt to strings
    // let salt = ethUtil.bufferToHex(ethUtil.setLengthLeft(10000, 32))
    let salt = 10000
    status
      ? status = 1
      : status = 0
    // status = ethUtil.bufferToHex(ethUtil.setLengthLeft(status, 32))
    // let hash = web3.fromAscii(this.state.votes[i].status + salt, 32)
    // let hash = utils.keccak256(status + salt)
    // if (hash === utils.keccak256(status + salt)) {
    type === 'tokens'
      ? this.revealToken(i, status, salt)
      : this.revealReputation(i, status, salt)
    // }
  }

  rescueVote (i, type) {
    type === 'tokens'
      ? this.rescueTokens()
      : this.rescueReputation()
  }

  commitToken (i, hash, status, salt) {
    let numTokens = this.state['tokVal' + i]
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        let prevPollID = this.getPrevPollID(numTokens, accounts[0])
        let taskAddr = await P.at(this.props.address).tasks(i)
        // console.log(taskAddr)
        let pollID = await T.at(taskAddr).pollId()
        await tr.voteCommit(this.props.address, i, numTokens, hash, prevPollID, {from: accounts[0]})
        this.props.voteCommitted({status: status, salt: salt, pollID: pollID, user: accounts[0], numTokens: numTokens, revealed: false})
      }
    })
  }

  revealToken (i, status, salt) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.voteReveal(this.props.address, i, status, salt, {from: accounts[0]})
        this.props.voteRevealed({i, user: accounts[0]})
        this.setState({
          votes: Object.assign({}, this.state.votes,
            {[i]: Object.assign({}, this.state.votes[i],
              { revealed: true }
            )})
        })
      }
    })
  }

  rescueToken (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.rescueTokens(this.props.address, i, {from: accounts[0]})
        this.setState({
          votes: Object.assign({}, this.state.votes,
            {[i]: Object.assign({}, this.state.votes[i],
              { rescued: true }
            )})
        })
      }
    })
  }

  commitReputation (i, hash, status, salt) {
    let numRep = this.state['repVal' + i]
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        let prevPollID = this.getPrevPollID(numRep, accounts[0])
        let taskAddr = await P.at(this.props.address).tasks(i)
        let task = await T.at(taskAddr)
        let pollID = await task.pollID()
        await rr.voteCommit(this.props.address, i, numRep, hash, prevPollID, {from: accounts[0]})
        this.props.voteCommitted({status: status, salt: salt, pollID: pollID, user: accounts[0], numTokens: numRep})
      }
    })
  }

  revealReputation (i, status, salt) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await rr.voteReveal(this.props.address, i, status, salt, {from: accounts[0]})
        this.props.voteRevealed({i, user: accounts[0]})
        this.setState({
          votes: Object.assign({}, this.state.votes,
            {[i]: Object.assign({}, this.state.votes[i],
              { revealed: true })})
        })
      }
    })
  }

  rescueReputation (i) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.rescueTokens(this.props.address, i, {from: accounts[0]})
        this.setState({
          votes: Object.assign({}, this.state.votes,
            {[i]: Object.assign({}, this.state.votes[i],
              { rescued: true }
            )})
        })
      }
    })
  }

  getPrevPollID (numTokens, user) {
    let pollInfo = this.props.users[user]   // get object of poll data w/pollID's as keys
    if (typeof pollInfo === 'undefined') return 0
    let keys = Object.keys(pollInfo)
    let currPollID = 0
    let currNumTokens = 0
    for (let i = 0; i < keys.length; i++) {
      if ((pollInfo[keys[i]].numTokens <= numTokens) && (pollInfo[keys[i]].numTokens > currNumTokens)) {
        currNumTokens = pollInfo[keys[i]].numTokens
        currPollID = keys[i]
      }
    }
    return currPollID
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
    if (typeof this.props.tasks !== 'undefined') {
      tasks = this.props.tasks.map((task, i) => {
        let rewardVal, rewardWork, needsVote
        if (this.props.tasks[i].validationRewardClaimable) {
          if (this.props.tasks[i].workerRewardClaimable) {
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
            needsVote = <Icon type='close' />
          } else {
            // validators can claim, task fails
            rewardVal =
              <div>
                <Button
                  type='danger' onClick={() => this.rewardValidator(i)}> Reward No Validator </Button>
              </div>
            rewardWork = <div>ineligible</div>
            needsVote = <Icon type='close' />
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
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'tokens', true)}> Reveal Vote (T)
                </Button>
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'tokens', false)}> Reveal Vote (TF)
                </Button>
                <Button
                  type='danger' onClick={() => this.rescueVote(i, 'tokens')}> Rescue (T)
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
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'reputation', true)}> Reveal Vote (R)
                </Button>
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'reputation', false)}> Reveal Vote (RF)
                </Button>
                <Button
                  type='danger' onClick={() => this.rescueVote(i, 'reputation')}> Rescue (R)
                </Button>
              </div>
            </div>
        }

        return {
          key: i,
          description: task.description,
          ethReward: `${web3.fromWei(this.props.project.weiCost) * (task.weighting / 100)} ETH`,
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
    project: state.projects[5][ownProps.address],
    tasks: state.projects[5][ownProps.address].tasks,
    users: state.polls.allUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    voteCommitted: (voteDetails) => dispatch(voteCommitted(voteDetails)),
    voteRevealed: (voteDetails) => dispatch(voteCommitted(voteDetails)),
    getTasks: (address, state) => dispatch(getTasks(address, state))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoteTasks)
