import React from 'react'
import { Input, Button } from 'antd'

export default (props) => {
  let color, withdrawButton
  if (props.fundingType === 'Token') {
    color = '#326BC1'
    withdrawButton = <Button style={{border: '1px solid rgba(0, 0, 0, 0.6)'}}>
      Withdraw
    </Button>
  } else {
    color = '#F5A623'
    withdrawButton = null
  }
  return (
    <div style={{height: 240, width: 500, marginBottom: 5, color: 'black'}}>
      <div style={{height: 20, backgroundColor: 'rgba(218, 218, 218, 0.5)'}} />
      <p style={{color: color, fontSize: 26, fontFamily: 'Avenir Next', marginTop: 5}}>{props.fundingType === 'Token' ? '$' : null }XX</p>
      <p style={{fontSize: 20, fontFamily: 'Lato', marginTop: -15}}>staked of {props.fundingType === 'tokens' ? '$' : null }XXX goal</p>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Input style={{fontSize: 14, fontFamily: 'Avenir Next', textAlign: 'center', maxWidth: 85, borderRadius: 0, border: '1px solid #989898'}} placeholder={'15,000'} />
        {withdrawButton}
        <Button style={{border: '1px solid rgba(0, 0, 0, 0.6)'}}>
          Fund
        </Button>
      </div>
      <p style={{fontSize: 20, fontFamily: 'Lato', marginTop: 15}}>{props.fundingType} Stakers: XX</p>
      <hr />
    </div>
  )
}
