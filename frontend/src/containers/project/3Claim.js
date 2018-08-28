import React from 'react'
import { connect } from 'react-redux'
import ClaimComponent from '../../components/project/3Claim'
import ButtonClaimTask from '../../contractComponents/stage3/ClaimTask'
import ButtonTaskComplete from '../../contractComponents/stage3/TaskComplete'
import { Button } from 'antd'
import { web3 } from '../../utilities/blockchain'
import moment from 'moment'
const ButtonGroup = Button.Group

class ClaimProject extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: []
    }
  }

  render () {
    let tasks
    if (this.props.project.taskList !== null && typeof this.props.project.tasks !== 'undefined') {
      let reputationCost = this.props.project.reputationCost
      let weiCost = this.props.project.weiCost
      tasks = JSON.parse(this.props.project.taskList).map((task, i) => {
        let weiReward = Math.floor(weiCost * task.percentage / 100)
        return {
          key: i,
          description: task.description,
          ethReward: `${web3.fromWei(weiReward, 'ether')} ETH`,
          repClaim: typeof reputationCost !== 'undefined' && typeof weiCost !== 'undefined' && typeof weiReward !== 'undefined' ? `${Math.floor(reputationCost * weiReward / weiCost)} rep` : '',
          buttons: <ButtonGroup>
            <ButtonClaimTask
              user={this.props.user}
              i={i}
              address={this.props.address}
            />
            <ButtonTaskComplete
              user={this.props.user}
              i={i}
              address={this.props.address}
            />
          </ButtonGroup>
        }
      })
    } else {
      tasks = []
    }

    return (
      <ClaimComponent
        name={this.props.project.name}
        user={this.props.user}
        address={this.props.address}
        photo={this.props.project.photo}
        summary={this.props.project.summary}
        location={this.props.project.location}
        cost={web3.fromWei(this.props.project.weiCost, 'ether')}
        reputationCost={this.props.project.reputationCost}
        date={moment(this.props.project.nextDeadline)}
        tasks={tasks}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[3][ownProps.address]
  }
}

export default connect(mapStateToProps)(ClaimProject)
