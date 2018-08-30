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
    let tasks, votes
    if (typeof this.props.tasks !== 'undefined') {
      tasks = this.props.tasks.slice(0).sort(function (a, b) {
        return a.index - b.index
      })
      tasks = tasks.map((task, i) => {
        votes = _.filter(this.props.votes, (vote) => { return vote.task.id === task.id ? vote : null })
        let rewardVal, rewardWork, rescueVote
        task.validationRewardClaimable
          ? rewardVal =
            <div>
              <ButtonRewardValidator
                type='Yes'
                user={this.props.user}
                address={this.props.address}
                i={i}
                state={this.props.state}
              />
            </div>
          : rewardVal =
            <Icon type='close' />

        task.workerRewardClaimable
          ? rewardWork =
            <div>
              <ButtonRewardTask
                user={this.props.user}
                address={this.props.address}
                tasks={tasks}
                i={i}
                state={this.props.state}
              />
            </div>
          : rewardWork =
            <Icon type='close' />
        votes.length !== 0 && !votes[0].revealed && !votes[0].rescued
          ? rescueVote =
            <div>
              <ButtonRescueVote
                user={this.props.user}
                address={this.props.address}
                i={i}
                type={votes[0].type}
              />
            </div>
          : rescueVote =
            <Icon type='close' />

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
