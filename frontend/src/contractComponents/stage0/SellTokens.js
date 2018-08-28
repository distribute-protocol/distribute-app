import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { sellTokens } from '../../actions/tokenActions'

const ButtonSellTokens = (props) => {
  return (<Button
    icon='plus-circle-o'
    color='primary'
    onClick={() => props.sellTokens(props.tokensToBuy, {from: props.user})}>
      Sell
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    sellTokens: (amount, txObj) => dispatch(sellTokens(amount, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonSellTokens)
