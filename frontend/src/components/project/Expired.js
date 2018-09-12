import React from 'react'
import ProjectHeader from '../shared/ProjectHeader'
import { web3 } from '../../utilities/blockchain'

export default ({
  project
}) => {
  return (
    <div style={{backgroundColor: '#DDE4E5', marginBottom: 30}}>
      <ProjectHeader
        name={project.name}
        address={project.address}
        photo={project.photo}
        summary={project.summary}
        location={project.location}
        cost={web3.fromWei(project.weiCost, 'ether')}
        reputationCost={project.reputationCost}
      />
    </div>
  )
}
