import React from 'react'
import { Input, Button } from 'antd'
import { color1, color2, grey3 } from '../../styles/colors'
import StakeProject from '../../contractComponents/stage1/StakeProject'
import UnstakeProject from '../../contractComponents/stage1/UnstakeProject'


export default (props) => {
  let color, withdrawButton
  if (props.fundingType === 'Token') {
    color = '#326BC1'
    withdrawButton = <Button style={{ border: `1px solid ${color1}`, backgroundColor: color1, color: 'white', width: 111 }}>
      Withdraw
    </Button>
  } else {
    color = '#F5A623'
    withdrawButton = <Button style={{ border: `1px solid ${color1}`, backgroundColor: color1, color: 'white', width: 111 }}>
      Withdraw
    </Button>
  }
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ display: 'flex' }}>
        <UnstakeProject />
        <StakeProject style={{ marginLeft: 35 }} />
      </div>
      <p style={{ fontSize: 20, fontFamily: 'Lato', marginTop: 15 }}>{props.fundingType} Stakers: {props.participants.length}</p>
      <hr style={{ marginLeft: 10, marginRight: 10, color: grey3, backgroundColor: grey3 }} />
    </div>
  )
}
//     <Input style={{fontSize: 22, fontFamily: 'Lato', textAlign: 'center', maxWidth: 100, borderRadius: 0, border: '1px solid #989898'}} placeholder={'15,000'} />
//     <p style={{color: color, fontSize: 26, fontFamily: 'Avenir Next', marginTop: 5}}>{props.fundingType === 'Token' ? `$${Math.ceil((parseInt(props.project.weiBal)) * (1 / 10 ** 18) * (parseInt(props.usdPerEth.price))).toFixed(2)}` : parseInt(props.project.reputationBalance)}</p>
//     <p style={{fontSize: 20, fontFamily: 'Lato', marginTop: -15}}>staked of {props.fundingType === 'Token' ? `$${Math.ceil((parseInt(props.project.weiCost)) * (1 / 10 ** 18) * (parseInt(props.usdPerEth.price))).toFixed(2)}` : parseInt(props.project.reputationCost) } goal</p>
