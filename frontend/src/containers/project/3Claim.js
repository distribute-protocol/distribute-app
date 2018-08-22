import React from 'react'
import { connect } from 'react-redux'
import ClaimComponent from '../../components/project/3Claim'
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
    this.submitFinalTaskList = this.submitFinalTaskList.bind(this)
    this.checkValidateStatus = this.checkValidateStatus.bind(this)
  }

  componentWillMount () {
  }

  async submitFinalTaskList () {
    this.props.submitFinalTaskList(this.props.address)
  }

  async claimTask (i) {
    this.props.claimTask(this.props.address, i)
  }

  submitTaskComplete (i) {
    this.props.submitTaskComplete(this.props.address, i)
  }

  checkValidateStatus () {
    this.props.checkValidateStatus(this.props.address)
  }

  render () {
    let tasks
    if (this.props.project.taskList !== null && typeof this.props.tasks !== 'undefined') {
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
            <Button
              disabled={!this.props.project.listSubmitted || this.props.tasks[i] === undefined || this.props.tasks[i].claimed}
              type='danger' onClick={() => this.claimTask(i)}>Claim</Button>
            <Button
              disabled={!this.props.project.listSubmitted || this.props.tasks[i] === undefined || !this.props.tasks[i].claimed || (this.props.tasks[i].claimed && this.props.tasks[i].complete)
              }
              type='danger' onClick={() => this.submitTaskComplete(i)}>Task Complete</Button>
          </ButtonGroup>
        }
      })
    } else {
      tasks = []
    }

    return (
      <ClaimComponent
        name={this.props.project.name}
        address={this.props.address}
        photo={this.props.project.photo}
        summary={this.props.project.summary}
        location={this.props.project.location}
        cost={web3.fromWei(this.props.project.weiCost, 'ether')}
        reputationCost={this.props.project.reputationCost}
        date={moment(this.props.project.nextDeadline)}
        tasks={tasks}
        listSubmitted={this.props.project.listSubmitted}
        submitFinalTaskList={this.submitFinalTaskList}
        claimTask={this.claimTask}
        checkValidateStatus={this.checkValidateStatus}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[3][ownProps.address],
    tasks: state.projects[3][ownProps.address].tasks
  }
}

export default connect(mapStateToProps)(ClaimProject)
