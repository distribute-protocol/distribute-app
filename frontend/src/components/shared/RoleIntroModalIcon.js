import React from 'react'

export default ({
  roleName,
  roleIcon,
  roleDescription,
  onRoleClick
}) => {
  if (onRoleClick === undefined) {
    onRoleClick = () => alert(roleName)
  }
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%'}}>
      <img style={{justifyContent: 'center'}} src={roleIcon} alt={roleName} onClick={onRoleClick} />
      <p style={{fontFamily: 'Roboto', fontSize: 18}}>{roleName}</p>
      <p style={{fontFamily: 'NowAltRegular', fontSize: 14, marginTop: -20}}>{roleDescription}</p>
    </div>
  )
}
