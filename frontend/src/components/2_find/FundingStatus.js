import React from 'react'
import { Button } from 'antd'
import { color1, color2, grey3 } from 'styles/colors'

export default (props) => {
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ display: 'flex' }}>
        <Button
          style={Object.assign({}, { backgroundColor: color2, color: 'white', width: 111, border: `1px solid ${color2}` }, props.style)}
          onClick={() => props.launchModal(props.fundingType, 'unstake')}>
          Withdraw
        </Button>
        <Button
          style={Object.assign({ backgroundColor: color1, color: 'white', width: 111, border: `1px solid ${color1}`, marginLeft: 35 }, props.style)}
          onClick={() => props.launchModal(props.fundingType, 'stake')}
        >
          Fund
        </Button>
      </div>
      <p style={{ fontSize: 20, fontFamily: 'Lato', marginTop: 15 }}>{props.fundingType} Stakers: {props.participants ? props.participants.length : 0}</p>
      <hr style={{ marginLeft: 10, marginRight: 10, color: grey3, backgroundColor: grey3 }} />
    </div>
  )
}
//     <Input style={{fontSize: 22, fontFamily: 'Lato', textAlign: 'center', maxWidth: 100, borderRadius: 0, border: '1px solid #989898'}} placeholder={'15,000'} />
//     <p style={{color: color, fontSize: 26, fontFamily: 'Avenir Next', marginTop: 5}}>{props.fundingType === 'Token' ? `$${Math.ceil((parseInt(props.project.weiBal)) * (1 / 10 ** 18) * (parseInt(props.usdPerEth.price))).toFixed(2)}` : parseInt(props.project.reputationBalance)}</p>
//     <p style={{fontSize: 20, fontFamily: 'Lato', marginTop: -15}}>staked of {props.fundingType === 'Token' ? `$${Math.ceil((parseInt(props.project.weiCost)) * (1 / 10 ** 18) * (parseInt(props.usdPerEth.price))).toFixed(2)}` : parseInt(props.project.reputationCost) } goal</p>
