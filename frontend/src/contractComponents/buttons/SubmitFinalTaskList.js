import React from 'react'
import { connect } from 'redux'
import { Button } from 'antd'
import { submitFinalTaskList } from '../actions/taskActions'

const ButtonSubmitFinalTaskList = (props) => {
  return (<Button
    disabled={props.project.listSubmitted}
    onClick={() => props.submitFinalTaskList(props.address)}>
      Submit Winning Hash List
  </Button>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[3][ownProps.address]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitFinalTaskList: (address) => dispatch(submitFinalTaskList(address))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonSubmitFinalTaskList)
