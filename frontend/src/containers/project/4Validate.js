import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import ValidateComponent from '../../components/project/4Validate'
import ValidateTask from '../task/4Validate'
import ButtonValidateTask from '../../contractComponents/stage4/ValidateTask'
import { web3 } from '../../utilities/blockchain'
import moment from 'moment'

class ValidateTasks extends React.Component {
  onChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render () {
    let tasks
    let returnInput = (i) => (
      <div>
        <div>
          <ButtonValidateTask
            user={this.props.user}
            address={this.props.address}
            state='Yes'
            i={i}
          />
          <ButtonValidateTask
            user={this.props.user}
            address={this.props.address}
            state='No'
            i={i}
          />
        </div>
        <div>
          <ValidateTask
            index={i}
            address={this.props.address}
          />
        </div>
      </div>)
    if (typeof this.props.tasks !== 'undefined') {
      tasks = this.props.tasks.slice(0).sort(function (a, b) {
        return a.index - b.index
      })
      tasks = tasks.map((task, i) => {
        let ethReward = web3.fromWei(Math.ceil(this.props.project.weiCost / 1.05) * (task.weighting / 100), 'ether')
        if (task.complete === false) {
          return {
            key: i,
            description: task.description,
            ethReward: <Icon type='close' />,
            usdReward: <Icon type='close' />,
            input: <div>This task was never completed.</div>
          }
        } else {
          return {
            key: i,
            description: task.description,
            ethReward: `${ethReward.toFixed(5)} ETH`,
            usdReward: `$${parseFloat(this.props.ethPrice * ethReward).toFixed(2)}`,
            input: returnInput(i)
          }
        }
      })
    } else {
      tasks = []
    }

    return (
      <ValidateComponent
        name={this.props.project.name}
        address={this.props.address}
        photo={this.props.project.photo}
        summary={this.props.project.summary}
        location={this.props.project.location}
        cost={web3.fromWei(Math.ceil(this.props.project.weiCost / 1.05), 'ether')}
        reputationCost={this.props.project.reputationCost}
        date={moment(this.props.project.nextDeadline)}
        tasks={tasks}
        user={this.props.user}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[4][ownProps.address],
    tasks: state.projects[4][ownProps.address].tasks
  }
}

export default connect(mapStateToProps)(ValidateTasks)
