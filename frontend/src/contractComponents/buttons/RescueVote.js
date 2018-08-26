import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { rescueVote } from '../../actions/taskActions'

const ButtonRescueVote = (props) => {
  return (<Button
    type='danger'
    onClick={() => props.rescueVote(props.type, props.address, props.i, {from: props.user})}>
    {`Rescue (${props.type === 'tokens' ? 'T' : 'R'})`}
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    rescueVote: (collateralType, projectAddress, taskIndex, txObj) => dispatch(rescueVote(collateralType, projectAddress, taskIndex, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonRescueVote)
