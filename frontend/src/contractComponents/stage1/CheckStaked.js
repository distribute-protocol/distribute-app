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
    checkStakedStatus: (type, address, val, txObj) => dispatch(checkStakedStatus(type, address, val, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonCheckStaked)
