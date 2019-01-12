import React from 'react'

export default ({
  roleName,
  roleIcon,
  roleDescription,
  onClick
}) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%', marginBottom: 30, marginLeft: 10, marginRight: 10}} onClick={onClick}>
      <img style={{justifyContent: 'center', cursor: 'pointer'}} src={roleIcon} alt={roleName} />
      <p style={{fontFamily: 'Roboto', fontSize: 18, margin: 0}}>{roleName}</p>
      <p style={{fontFamily: 'NowAltRegular', fontSize: 14, textAlign: 'center', margin: 0}}>{roleDescription}</p>
    </div>
  )
}
