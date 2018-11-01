import React from 'react'

export default ({
  roleName,
  roleIcon,
  roleDescription,
  onClick
}) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%'}} onClick={onClick}>
      <img style={{justifyContent: 'center'}} src={roleIcon} alt={roleName} />
      <p style={{fontFamily: 'Roboto', fontSize: 18}}>{roleName}</p>
      <p style={{fontFamily: 'NowAltRegular', fontSize: 14, marginTop: -20}}>{roleDescription}</p>
    </div>
  )
}
