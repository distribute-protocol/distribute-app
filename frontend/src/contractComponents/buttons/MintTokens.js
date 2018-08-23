import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { web3 } from '../../utilities/blockchain'
import { mintTokens } from '../../actions/tokenActions'

const ButtonMintTokens = (props) => {
  return (<Button icon='plus-circle-o' color='primary'
    onClick={() => props.mintTokens(props.tokensToBuy, {value: web3.toWei(Math.ceil(props.ethToSend * 100000) / 100000, 'ether'), from: props.user})}>
      Buy
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    mintTokens: (amount, txObj) => dispatch(mintTokens(amount, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonMintTokens)
