import React from 'react'
import { Button } from 'antd'

export default ({
  role
}) => {
  let roleColor, buttonName
  switch (role) {
    case 'Initiator':
      break
    case 'Finder':
      roleColor = '#FF8E6F'
      buttonName = 'Discoveries'
      break
  }
  return (
    <div style={{paddingLeft: 75, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 45, backgroundColor: roleColor}}>
      <b><p style={{paddingTop: 21, color: 'white', fontFamily: 'Lato', fontSize: 24}}>{role}</p></b>
      <Button style={{marginRight: 15, color: 'white', border: '1px solid white', fontSize: 12, fontFamily: 'PingFang SC', borderRadius: 4, cursor: 'pointer', backgroundColor: roleColor}}>
        {buttonName}
      </Button>
    </div>
  )
}
