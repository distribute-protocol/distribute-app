import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { rewardProposer } from '../../actions/projectActions'

const ButtonRewardProposer = (props) => {
  return (<Button
    disabled={0}
    // disabled to be changed once reducer is written
    style={{marginTop: 10}}
    type='danger'
    onClick={() => props.rewardProposer(props.address, {from: props.user})}>
      Reward Proposer
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    rewardProposer: (address, txObj) => dispatch(rewardProposer(address, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonRewardProposer)
