import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { rewardTask } from '../../actions/taskActions'
import { eth } from '../../utilities/blockchain'

const ButtonRewardTask = (props) => {
  return (<Button
    disabled={props.tasks[props.i].claimer.account !== eth.accounts[0] || props.tasks[props.i].workerRewarded}
    type='danger'
    onClick={() => props.rewardTask(props.address, props.i, {from: props.user}, props.state)}>
    Reward Task
  </Button>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[ownProps.state][ownProps.address]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    rewardTask: (address, index, txObj, state) => dispatch(rewardTask(address, index, txObj, state))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRewardTask)
