import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { rewardValidator } from '../../actions/taskActions'

const ButtonRewardValidator = (props) => {
  return (<Button
    disabled={props.project.valRewarded === undefined || props.project.valRewarded[props.i] === undefined || !props.project.valRewarded[props.i].state || props.project.valRewarded[props.i].rewarded}
    type='danger'
    onClick={() => props.rewardValidator(props.address, props.i, {from: props.user})}>
    {`Reward ${props.type} Validator`}
  </Button>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[5][ownProps.address]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    rewardValidator: (address, index, txObj) => dispatch(rewardValidator(address, index, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRewardValidator)
