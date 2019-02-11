import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { checkStakedStatus } from '../../actions/projectActions'

const ButtonCheckStaked = (props) => {
  return (<Button
    style={{marginTop: 10}}
    onClick={() => props.checkStakedStatus(props.address, {from: props.user})}>
      Check Staked
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkStakedStatus: (address, txObj) => dispatch(checkStakedStatus(address, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonCheckStaked)
