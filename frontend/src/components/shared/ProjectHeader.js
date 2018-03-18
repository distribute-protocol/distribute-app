import React from 'react'

export default ({
  name,
  address,
  photo,
  summary,
  location,
  cost,
  reputationCost
}) => {
  return (
    <div>
      <div style={{padding: 10}}>
        <h3>{name}</h3>
      </div>
      <div style={{padding: 10}}>
        <div style={{wordWrap: 'break-word'}}>Address: <strong>{`${address}`}</strong></div>
        {/* <div>State: <strong>{`${projectState}`}</strong></div> */}
        { typeof photo !== 'undefined'
          ? <img style={{height: 200, width: 200}} src={photo} alt='projectPhoto' />
          : null
        }
        <div>Summary: {`${summary}`}</div>
        <div>Location: <strong>{`${location}`}</strong></div>
        <div>Cost: <strong>{`${cost}`} ETH</strong></div>
        <div>Reputation Cost: <strong>{`${reputationCost}`}</strong></div>
      </div>
    </div>
  )
}
