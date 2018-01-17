import React from 'react'

const Project = ({cost, description, stakingPeriod, address, index}) => {
  let d
  if (typeof stakingPeriod !== 'undefined') { d = new Date(stakingPeriod) }
  return (
    <tr>
      <td>{`${description}`}</td>
      <td>{`${address}`}</td>
      <td>{`${cost}`}</td>
      <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td>
    </tr>
  )
}

export default Project
