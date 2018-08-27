import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { checkVotingStatus } from '../../actions/projectActions'

const ButtonCheckVoting = (props) => {
  return (<Button
    style={{margin: 20}}
    onClick={() => props.checkVotingStatus(props.address, {from: props.user})}>
      Check Voting
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkVotingStatus: (address, txObj) => dispatch(checkVotingStatus(address, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonCheckVoting)
