import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { unstakeProject } from '../../actions/projectActions'
import { color2 } from '../../styles/colors'
const ButtonUnstakeProject = (props) => {
  let style = Object.assign({}, { backgroundColor: color2, color: 'white', width: 111, border: `1px solid ${color2}` }, props.style)
  return (<Button
    style={style}
    onClick={() => props.launchModal(props.fundingType)}>
    Withdraw
  </Button>)
}
// onClick={() => props.unstakeProject(props.type, props.address, props.val, { from: props.user })}>
const mapDispatchToProps = (dispatch) => {
  return {
    unstakeProject: (type, address, val, txObj) => dispatch(unstakeProject(type, address, val, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonUnstakeProject)
