import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { submitFinalTaskList } from '../../actions/taskActions'

const ButtonSubmitFinalTaskList = (props) => {
  return (<Button
    disabled={props.project.listSubmitted}
    onClick={() => props.submitFinalTaskList(props.address, {from: props.user})}>
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
    submitFinalTaskList: (address, txObj) => dispatch(submitFinalTaskList(address, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonSubmitFinalTaskList)
