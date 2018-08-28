import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { checkFinalStatus } from '../../actions/projectActions'

const ButtonCheckFinal = (props) => {
  return (<Button
    style={{margin: 20}}
    onClick={() => props.checkFinalStatus(props.address, {from: props.user})}>
      Check Final
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkFinalStatus: (address, txObj) => dispatch(checkFinalStatus(address, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonCheckFinal)
