import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { validateTask } from '../../actions/taskActions'

const ButtonValidateTask = (props) => {
  let state
  props.state === 'Yes'
    ? state = true
    : state = false
  return (<Button
    type='danger'
    onClick={() => props.validateTask(props.address, props.i, state, {from: props.user})}>
    {`${props.state}`}
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    validateTask: (address, taskIndex, validationState, txObj) => dispatch(validateTask(address, taskIndex, validationState, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonValidateTask)
