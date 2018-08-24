import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { checkActiveStatus } from '../../actions/projectActions'

const ButtonCheckActive = (props) => {
  return (<Button
    onClick={() => props.checkActiveStatus(props.address, {from: props.user})}>
      Submit Winning Hash List
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkActiveStatus: (address, txObj) => dispatch(checkActiveStatus(address, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonCheckActive)
