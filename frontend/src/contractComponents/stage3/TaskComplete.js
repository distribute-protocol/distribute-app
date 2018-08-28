import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { submitTaskComplete } from '../../actions/taskActions'

const ButtonTaskComplete = (props) => {
  return (<Button
    disabled={!props.project.listSubmitted || props.tasks[props.i] === undefined || !props.tasks[props.i].claimed || (props.tasks[props.i].claimed && props.tasks[props.i].complete)}
    type='danger'
    onClick={() => props.submitTaskComplete(props.address, props.i, {from: props.user})}>
      Task Complete
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
    submitTaskComplete: (address, index, txObj) => dispatch(submitTaskComplete(address, index, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonTaskComplete)
