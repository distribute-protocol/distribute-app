import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { checkValidateStatus } from '../../actions/projectActions'

const ButtonCheckValidate = (props) => {
  return (<Button
    onClick={() => props.checkValidateStatus(props.address, {from: props.user})}>
      Check Validate
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkValidateStatus: (address, txObj) => dispatch(checkValidateStatus(address, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonCheckValidate)
