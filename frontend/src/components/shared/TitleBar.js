import React from 'react'
import { Button } from 'antd'
import share from '../../images/titlebaricons/share.svg'
import { font1 } from '../../styles/fonts'
import { gradient1, gradient2, gradient3, gradient4, gradient5, gradient6 } from '../../styles/colors'

export default ({
  role, title, project
}) => {
  let roleColor, button
  switch (role.toLowerCase()) {
    case 'initiator':
      roleColor = gradient1
      button = <img style={{ marginRight: 30, cursor: 'pointer' }}
        // onClick={() => this.props.redirect('/profile')}
        alt='profile' src={share} />
      break
    case 'finder':
      roleColor = gradient2
      button = <Button style={{ marginRight: 15, color: 'white', border: '1px solid white', fontSize: 12, fontFamily: font1, borderRadius: 4, cursor: 'pointer', backgroundColor: roleColor }}>
        Discoveries
      </Button>
      break
    case 'planner':
      roleColor = gradient3
      button = <Button style={{ marginRight: 15, color: 'white', border: '1px solid white', fontSize: 12, fontFamily: font1, borderRadius: 4, cursor: 'pointer', backgroundColor: roleColor }}>
        Plans
      </Button>
      break
    case 'doer':
      roleColor = gradient4
      button = <Button style={{ marginRight: 15, color: 'white', border: '1px solid white', fontSize: 12, fontFamily: font1, borderRadius: 4, cursor: 'pointer', backgroundColor: roleColor }}>
        Plans
      </Button>
      break
    case 'validator':
      roleColor = gradient4
      button = <Button style={{ marginRight: 15, color: 'white', border: '1px solid white', fontSize: 12, fontFamily: font1, borderRadius: 4, cursor: 'pointer', backgroundColor: roleColor }}>
        Plans
      </Button>
      break
    case 'resolver':
      roleColor = gradient4
      button = <Button style={{ marginRight: 15, color: 'white', border: '1px solid white', fontSize: 12, fontFamily: font1, borderRadius: 4, cursor: 'pointer', backgroundColor: roleColor }}>
        Plans
      </Button>
      break
    default:
      roleColor = 'white'
      button = null
      break
  }
  return (
    <div style={{ flexDirection: 'row', marginLeft: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 55, backgroundColor: roleColor }}>
      <p style={{ color: 'white', fontFamily: font1, fontSize: 28, margin: 0, marginLeft: 20, fontWeight: 500 }}>{title}</p>
      {project ? null : button}
    </div>
  )
}
