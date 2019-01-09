import React from 'react'
import { Button } from 'antd'
import share from '../../images/titlebaricons/share.svg'
import { font1 } from '../../styles/fonts'

export default ({
  role
}) => {
  let roleColor, button
  switch (role) {
    case 'Initiator':
      roleColor = '#FFC161'
      button = <img style={{ marginRight: 30, cursor: 'pointer' }}
        // onClick={() => this.props.redirect('/profile')}
        alt='profile' src={share} />
      break
    case 'Finder':
      roleColor = '#FF8E6F'
      button = <Button style={{ marginRight: 15, color: 'white', border: '1px solid white', fontSize: 12, fontFamily: font1, borderRadius: 4, cursor: 'pointer', backgroundColor: roleColor }}>
        Discoveries
      </Button>
      break
    default:
      roleColor = 'white'
      button = null
      break
  }
  return (
    <div style={{ flexDirection: 'row', marginLeft: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 55, backgroundColor: roleColor }}>
      <b><p style={{ color: 'white', fontFamily: 'Avenir', fontSize: 28, margin: 0, marginLeft: 20 }}>{role}</p></b>
      {button}
    </div>
  )
}
