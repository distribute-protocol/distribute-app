import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { claimTask } from '../../actions/taskActions'

const ButtonClaimTask = (props) => {
  console.log(props)
  return (<Button
    disabled={!props.project.listSubmitted || props.tasks[props.i] === undefined || props.tasks[props.i].claimed}
    type='danger'
    onClick={() => props.claimTask(props.address, props.i, {from: props.user})}>
      Claim Task
  </Button>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[3][ownProps.address],
    tasks: state.projects[3][ownProps.address].tasks
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    claimTask: (address, index, txObj) => dispatch(claimTask(address, index, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonClaimTask)
