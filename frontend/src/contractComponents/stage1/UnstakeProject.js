import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { unstakeProject } from '../../actions/projectActions'

const ButtonUnstakeProject = (props) => {
  let style
  props.type === 'tokens'
    ? style = {backgroundColor: '#1FA9FF', color: 'white'}
    : style = {backgroundColor: '#0BA16D', color: 'white'}
  return (<Button
    style={style}
    icon='down-circle-o'
    color='primary'
    onClick={() => props.unstakeProject(props.type, props.address, props.val, {from: props.user})}>
    {`${props.type}`}
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    unstakeProject: (type, address, val, txObj) => dispatch(unstakeProject(type, address, val, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonUnstakeProject)
