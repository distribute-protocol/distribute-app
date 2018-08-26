import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { revealVote } from '../../actions/taskActions'

const ButtonRevealVote = (props) => {
  console.log(props.status)
  return (<Button
    type='danger'
    onClick={() => props.voteReveal(props.type, props.address, props.i, props.status, parseInt(props.salt, 10), {from: props.user})}>
    {`Reveal Vote (${props.type === 'tokens' ? 'T' : 'R'}${props.status ? '' : 'A'})`}
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    revealVote: (collateralType, projectAddress, taskIndex, vote, salt, txObj) => dispatch(revealVote(collateralType, projectAddress, taskIndex, vote, salt, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonRevealVote)
