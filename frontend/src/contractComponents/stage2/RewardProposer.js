import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { rewardProposer } from '../../actions/projectActions'

const ButtonRewardProposer = (props) => {
  return (<Button
    disabled={props.proposerRewarded}
    style={{marginTop: 10}}
    type='danger'
    onClick={() => props.rewardProposer(props.address, {from: props.user})}>
      Reward Proposer
  </Button>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    proposerRewarded: state.projects[2][ownProps.address].proposerRewarded
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    rewardProposer: (address, txObj) => dispatch(rewardProposer(address, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRewardProposer)
