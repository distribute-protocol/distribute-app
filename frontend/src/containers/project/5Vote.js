import React from 'react'
import { connect } from 'react-redux'
import VoteComponent from '../../components/project/5Vote'
import { Icon } from 'antd'
import { eth, web3 } from '../../utilities/blockchain'
import { getUserValidations } from '../../actions/taskActions'
import ButtonRewardValidator from '../../contractComponents/stage5/RewardValidator'
import ButtonRewardTask from '../../contractComponents/stage5/RewardTask'
import ButtonCommitVote from '../../contractComponents/stage5/CommitVote'
import ButtonRevealVote from '../../contractComponents/stage5/RevealVote'
import ButtonRescueVote from '../../contractComponents/stage5/RescueVote'
import moment from 'moment'
import * as _ from 'lodash'

class VoteTasks extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: [],
      votes: {}
    }
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
                      ? (<ButtonRevealVote
                        user={this.props.user}
                        address={this.props.address}
                        i={vote.task.index}
                        type='tokens'
                        status={1}
                        salt={vote.salt}
                      />)
                      : (<ButtonRevealVote
                        user={this.props.user}
                        address={this.props.address}
                        i={vote.task.index}
                        type='tokens'
                        status={0}
                        salt={vote.salt}
                      />)
                    : parseInt(vote.vote, 10)
                      ? (<ButtonRevealVote
                        user={this.props.user}
                        address={this.props.address}
                        i={vote.task.index}
                        type='reputation'
                        status={1}
                        salt={vote.salt}
                      />)
                      : (<ButtonRevealVote
                        user={this.props.user}
                        address={this.props.address}
                        i={vote.task.index}
                        type='reputation'
                        status={0}
                        salt={vote.salt}
                      />)
                  }
                  {/*   <ButtonRescueVote
                    user={this.props.user}
                    address={this.props.address}
                    i={vote.task.index}
                    type='reputation'
                    /> */}
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
                <ButtonCommitVote
                  user={this.props.user}
                  address={this.props.address}
                  i={i}
                  status='Yes'
                  type='tokens'
                  input={this.state['tokVal' + i]}
                />
                <ButtonCommitVote
                  user={this.props.user}
                  address={this.props.address}
                  i={i}
                  status='No'
                  type='tokens'
                  input={this.state['tokVal' + i]}
                />
                {/* <Button
                  type='danger' onClick={() => this.revealTask(i, 'tokens', true)}> Reveal Vote (T)
                </Button>
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'tokens', false)}> Reveal Vote (TF)
                </Button>
                <ButtonRescueVote
                user={this.props.user}
                address={this.props.address}
                i={i}
                type='tokens'
                /> */}
              </div>
              <div>
                <input
                  name={'repVal' + i}
                  placeholder='reputation'
                  onChange={(e) => this.onChange(e)}
                  value={this.state['repVal' + i] || ''}
                />
                <ButtonCommitVote
                  user={this.props.user}
                  address={this.props.address}
                  i={i}
                  status='Yes'
                  type='reputation'
                  input={this.state['repVal' + i]}
                />
                <ButtonCommitVote
                  user={this.props.user}
                  address={this.props.address}
                  i={i}
                  status='No'
                  type='reputation'
                  input={this.state['repVal' + i]}
                />
                {/* <Button
                  type='danger' onClick={() => this.revealTask(i, 'reputation', true)}> Reveal Vote (R)
                </Button>
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'reputation', false)}> Reveal Vote (RF)
                </Button>
                <ButtonRescueVote
                user={this.props.user}
                address={this.props.address}
                i={i}
                type='reputation'
                /> */}
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
