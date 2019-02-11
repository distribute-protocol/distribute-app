import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { mintTokens } from '../../actions/tokenActions'
import { brandColor } from '../../styles/colors'
import { font1 } from '../../styles/fonts'

const ButtonMintTokens = (props) => {
  return (<Button
    // icon='plus-circle-o'
    style={{ height: 50, width: 200, backgroundColor: brandColor, color: 'white', fontFamily: font1, fontSize: 22 }}
    onClick={() => props.mintTokens(props.tokensToBuy, { value: props.ethToSend, from: props.wallet })}>
      Confirm
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    mintTokens: (amount, txObj) => dispatch(mintTokens(amount, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonMintTokens)
