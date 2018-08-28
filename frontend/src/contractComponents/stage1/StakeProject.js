import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { stakeProject } from '../../actions/projectActions'

const ButtonStakeProject = (props) => {
  let style
  props.type === 'tokens'
    ? style = {backgroundColor: '#0B1899', color: 'white'}
    : style = {backgroundColor: '#08734E', color: 'white'}
  return (<Button
    style={style}
    icon='up-circle-o'
    color='primary'
    onClick={() => props.stakeProject(props.type, props.address, props.val, {from: props.user})}>
    {`${props.type}`}
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    stakeProject: (type, address, val, txObj) => dispatch(stakeProject(type, address, val, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonStakeProject)
