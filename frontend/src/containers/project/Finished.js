import React from 'react'
import { connect } from 'react-redux'
import FinishedComponent from '../../components/project/Finished'
import { getUserValidations } from '../../actions/taskActions'
import ButtonRewardValidator from '../../contractComponents/stage5/RewardValidator'
import ButtonRewardTask from '../../contractComponents/stage5/RewardTask'
import ButtonRescueVote from '../../contractComponents/stage5/RescueVote'
import { web3, eth } from '../../utilities/blockchain'
import { Icon } from 'antd'
import moment from 'moment'
import * as _ from 'lodash'

class FinishedProject extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: []
    }
  }

  componentWillMount () {
    this.getUserValidations()
  }

  async getUserValidations () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.getUserValidations(this.props.address, accounts[0], this.props.state)
      }
    })
  }

  render () {
    console.log(this.props.votes)
    console.log(this.props.tasks)
    let tasks, votes
    if (typeof this.props.tasks !== 'undefined') {
      tasks = this.props.tasks.slice(0).sort(function (a, b) {
        return a.index - b.index
      })
      tasks = tasks.map((task, i) => {
        votes = _.filter(this.props.votes, (vote) => { return vote.task.id === task.id ? vote : null })
        let rewardVal, rewardWork, rescueVote
        if (tasks[i].validationRewardClaimable) {
          if (tasks[i].workerRewardClaimable) {
            // validators and workers can claim
            // check to see if user can claim, then once they claim turn off the button
            // pull validations from task, filtered by current metamask address
            rewardVal = <Icon type='close' />
            rewardWork = <Icon type='close' />
            rescueVote = <Icon type='close' />
          } else {
            // validators can claim, task fails
            rewardVal = <Icon type='close' />
            rewardWork = <Icon type='close' />
            rescueVote = <Icon type='close' />
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
                </div>
              </div> : null
          })
          rescueVote =
            <div>
              <div>
                <input
                  name={'tokVal' + i}
                  placeholder='tokens'
                  onChange={(e) => this.onChange(e)}
                  value={this.state['tokVal' + i] || ''}
                />
              </div>
              <div>
                <input
                  name={'repVal' + i}
                  placeholder='reputation'
                  onChange={(e) => this.onChange(e)}
                  value={this.state['repVal' + i] || ''}
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
          rescueVote: rescueVote,
          votes: votes
        }
      })
    } else {
      tasks = []
    }

    return (
      <FinishedComponent
        name={this.props.project.name}
        address={this.props.address}
        photo={this.props.project.photo}
        summary={this.props.project.summary}
        location={this.props.project.location}
        cost={web3.fromWei(this.props.project.cost, 'ether')}
        reputationCost={this.props.project.reputationCost}
        date={moment(this.props.project.nextDeadline * 1000)}
        user={this.props.user}
        tasks={tasks}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[ownProps.state][ownProps.address],
    tasks: state.projects[ownProps.state][ownProps.address].tasks,
    votes: state.user.votes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserValidations: (address, user, state) => dispatch(getUserValidations(address, user, state))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FinishedProject)
