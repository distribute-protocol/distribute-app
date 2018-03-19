import React from 'react'
import ProjectHeader from '../shared/ProjectHeader'

export default ({
  name,
  address,
  photo,
  summary,
  location,
  cost,
  reputationCost,
  date,
  state
}) => {
  return (
    <div style={{backgroundColor: '#DDE4E5', marginBottom: 30}}>
      <ProjectHeader
        name={name}
        address={address}
        photo={photo}
        summary={summary}
        location={location}
        cost={cost}
        reputationCost={reputationCost}
      />
      <div style={{padding: 10}}>
        {`Project State: ${state}`}
      </div>
    </div>
  )
}
