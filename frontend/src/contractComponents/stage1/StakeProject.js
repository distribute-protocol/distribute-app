import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { stakeProject } from '../../actions/projectActions'
import { color1 } from '../../styles/colors'
const ButtonStakeProject = (props) => {
  let style = Object.assign({ backgroundColor: color1, color: 'white', width: 111, border: `1px solid ${color1}` }, props.style)
  return (<Button
    style={style}
    onClick={() => props.stakeProject(props.type, props.address, props.val, { from: props.user })}>
    Fund
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    stakeProject: (type, address, val, txObj) => dispatch(stakeProject(type, address, val, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonStakeProject)
