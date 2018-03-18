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
    <div>
      <ProjectHeader
        name={name}
        address={address}
        photo={photo}
        summary={summary}
        location={location}
        cost={cost}
        reputationCost={reputationCost}
      />
      <div>
        {`Project State: ${state}`}
      </div>
    </div>
  )
}
