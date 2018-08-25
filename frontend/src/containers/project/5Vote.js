import React from 'react'
import { connect } from 'react-redux'
import VoteComponent from '../../components/project/5Vote'
import { Button, Icon } from 'antd'
import {eth, web3, P, T} from '../../utilities/blockchain'
import { getUserValidations } from '../../actions/taskActions'
import ButtonRewardValidator from '../../contractComponents/buttons/RewardValidator'
import ButtonRewardTask from '../../contractComponents/buttons/RewardTask'
// import { voteCommitted, voteRevealed } from '../../actions/pollActions'
import moment from 'moment'
import { utils } from 'ethers'
import * as _ from 'lodash'

class VoteTasks extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: [],
      votes: {}
    }
    this.voteTask = this.voteTask.bind(this)
  }

  componentWillMount () {
    this.getProjectStatus()
    this.getUserValidations()
  }

  // let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
  async getProjectStatus () {
    this.setState(this.props.project)
  }

  async getUserValidations () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.getUserValidations(this.props.address, accounts[0])
      }
    })
  }

  onChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  // Can Vote Commit...Vote Reveal is another beast, need to think about UI
  async voteTask (i, type, status) {
    let salt = Math.floor(Math.random() * Math.floor(1000000000000000000000)).toString()   // get random salt between 0 and 10000
    // convert status and salt to strings
    // let salt = 10000
    // let salt = ethUtil.bufferToHex(ethUtil.setLengthLeft(10000, 32))
    // console.log(salt, 'waw')
    status
      ? status = 1
      : status = 0
    // status = ethUtil.bufferToHex(ethUtil.setLengthLeft(status, 32))
    // console.log(status + salt)
    // this.props.storeVote(i, status, salt)
    // let vote = {key: i, status, salt, revealed: false, rescued: false}
    // this.setState({votes: Object.assign({}, this.state.votes, {[i]: vote})})
    let secretHash = utils.solidityKeccak256(['int', 'int'], [status, salt])
    // console.log(i, type, status, this.state['tokVal' + i], this.state['repVal' + i])
    // console.log(this.props.users)
    let value
    type === 'tokens'
      ? value = this.state['tokVal' + i]
      : value = this.state['repVal' + i]
    let taskAddr = await P.at(this.props.address).tasks(i)
    let task = await T.at(taskAddr)
    let pollID = await task.pollId()
    this.props.voteCommit(type, this.props.address, i, value, secretHash, status, salt, pollID)
    // this.props.voteCommitted({status: status, salt: salt, pollID: pollID, user: accounts[0], numTokens: numTokens, revealed: false})
  }

  revealTask (i, type, status, salt) {
    // let salt = this.state.votes[i].salt
    // convert status and salt to strings
    // let salt = ethUtil.bufferToHex(ethUtil.setLengthLeft(10000, 32))
    status
      ? status = 1
      : status = 0
    // status = ethUtil.bufferToHex(ethUtil.setLengthLeft(status, 32))
    // let hash = web3.fromAscii(this.state.votes[i].status + salt, 32)
    // let hash = utils.keccak256(status + salt)
    // if (hash === utils.keccak256(status + salt)) {
    // console.log(type, this.props.address, i, status, salt)
    this.props.voteReveal(type, this.props.address, i, status, salt)
    // this.props.voteRevealed({i, user: accounts[0]})
    // this.setState({
    //   votes: Object.assign({}, this.state.votes,
    //     {[i]: Object.assign({}, this.state.votes[i],
    //       { revealed: true }
    //     )})
    // })
  }

  rescueVote (i, type) {
    this.props.voteRescue(type, this.props.address, i)
    // this.setState({
    //   votes: Object.assign({}, this.state.votes,
    //     {[i]: Object.assign({}, this.state.votes[i],
    //       { rescued: true }
    //     )})
    // })
  }

  render () {
    let tasks, votes
    if (typeof this.props.tasks !== 'undefined') {
      tasks = this.props.tasks.slice(0).sort(function (a, b) {
        return a.index - b.index
      })
      // console.log(this.props.votes, 'votes')
      // console.log(tasks, 'tasks')
      tasks = tasks.map((task, i) => {
        votes = _.filter(this.props.votes, (vote) => { return vote.task.id === task.id ? vote : null })
        let rewardVal, rewardWork, needsVote
        if (tasks[i].validationRewardClaimable) {
          if (tasks[i].workerRewardClaimable) {
            // validators and workers can claim
            // check to see if user can claim, then once they claim turn off the button
            // pull validations from task, filter by current metamask address
            rewardVal =
              <div>
                <ButtonRewardValidator
                  type='Yes'
                  user={this.props.user}
                  address={this.props.address}
                  i={i}
                />
              </div>
            rewardWork =
              <div>
                <ButtonRewardTask
                  user={this.props.user}
                  address={this.props.address}
                  tasks={tasks}
                  i={i}
                />
              </div>
            needsVote = <Icon type='close' />
          } else {
            // validators can claim, task fails
            rewardVal =
              <div>
                <ButtonRewardValidator
                  type='No'
                  user={this.props.user}
                  address={this.props.address}
                  i={i}
                />
              </div>
            rewardWork = <Icon type='close' />
            needsVote = <Icon type='close' />
          }
        } else {
          // vote needs to happen
          rewardVal = <Icon type='clock-circle-o' />
          rewardWork = <Icon type='clock-circle-o' />
          votes = votes.map((vote, i) => {
            return !vote.revealed
              ? <div key={i}>
                <div>
                  <div>{`Poll ID: ${vote.pollID}`}</div>
                  <div>{`Amount: ${vote.amount}`}</div>
                  <div>{`Salt: ${vote.salt}`}</div>
                  <div>{`Vote: ${parseInt(vote.vote, 10) ? 'Approve' : 'Deny'}`}</div>
                  { vote.type === 'tokens'
                    ? parseInt(vote.vote, 10)
                      ? (<Button type='danger' onClick={() => this.revealTask(vote.task.index, 'tokens', true, parseInt(vote.salt, 10))}>
                        Reveal Vote (T)
                      </Button>)
                      : (<Button type='danger' onClick={() => this.revealTask(vote.task.index, 'tokens', false, parseInt(vote.salt, 10))}>
                        Reveal Vote (TA)
                      </Button>)
                    : parseInt(vote.vote, 10)
                      ? (<Button type='danger' onClick={() => this.revealTask(vote.task.index, 'reputation', true, parseInt(vote.salt, 10))}>
                        Reveal Vote (R)
                      </Button>)
                      : (<Button type='danger' onClick={() => this.revealTask(vote.task.index, 'reputation', false, parseInt(vote.salt, 10))}>
                        Reveal Vote (RA)
                      </Button>)
                  }
                  {/* <Button
                    type='danger' onClick={() => this.rescueVote(vote.task.index, 'tokens')}> Rescue (T)
                  </Button> */}
                </div>
              </div> : null
          })
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
                {/* <Button
                  type='danger' onClick={() => this.revealTask(i, 'tokens', true)}> Reveal Vote (T)
                </Button>
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'tokens', false)}> Reveal Vote (TF)
                </Button>
                <Button
                  type='danger' onClick={() => this.rescueVote(i, 'tokens')}> Rescue (T)
                </Button> */}
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
                {/* <Button
                  type='danger' onClick={() => this.revealTask(i, 'reputation', true)}> Reveal Vote (R)
                </Button>
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'reputation', false)}> Reveal Vote (RF)
                </Button>
                <Button
                  type='danger' onClick={() => this.rescueVote(i, 'reputation')}> Rescue (R)
                </Button> */}
              </div>
            </div>
        }

        return {
          key: i,
          description: task.description,
          ethReward: `${web3.fromWei(this.props.project.weiCost) * (task.weighting / 100)} ETH`,
          rewardValidator: rewardVal,
          rewardWorker: rewardWork,
          taskNeedsVote: needsVote,
          votes: votes
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
        user={this.props.user}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[5][ownProps.address],
    tasks: state.projects[5][ownProps.address].tasks,
    votes: state.user.votes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserValidations: (address, user) => dispatch(getUserValidations(address, user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoteTasks)
