import React from 'react'
import moment from 'moment'

const Project = ({cost, description, stakingEndDate, address, index}) => {
  let d
  // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
  if (typeof stakingEndDate !== 'undefined') { d = moment(stakingEndDate) }
  return (
    <tr>
      <th scope='row'>{`${index + 1}`}</th>
      <td>{`${description}`}</td>
      <td>{`${address}`}</td>
      <td>{`${cost}`}</td>
      {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
      <td>{typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</td>
    </tr>
  )
}

export default Project
