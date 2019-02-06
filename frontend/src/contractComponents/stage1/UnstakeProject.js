import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { unstakeProject } from '../../actions/projectActions'
import { color2 } from '../../styles/colors'
const ButtonUnstakeProject = (props) => {
  let style = Object.assign({}, { backgroundColor: color2, color: 'white', width: 111, border: `1px solid ${color2}` }, props.style)
  return (<Button
    style={style}
    onClick={() => props.unstakeProject(props.type, props.address, props.val, { from: props.user })}>
    Withdraw
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    unstakeProject: (type, address, val, txObj) => dispatch(unstakeProject(type, address, val, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonUnstakeProject)
