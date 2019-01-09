import React from 'react'
import { Button, Col, Row, Pagination } from 'antd'
import ProjectCard from './ProjectCard'
import mapicon from '../../images/mapicon.svg'
import { font1 } from '../../styles/fonts'

export default (
  projectData
) => {
  const projects = typeof projectData.projectData !== `undefined`
    ? Object.keys(projectData.projectData).map((address, i) => {
      return <Col key={i} index={i} span={6} style={{ marginBottom: 32 }}>
        <ProjectCard
          project={projectData.projectData[address]} />
      </Col>
    })
    : null
  const gutter = { xs: 8, sm: 16, md: 24, lg: 32 }
  return (
    <div style={{ height: '80%', flex: 1, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
      <div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', color: 'black' }}>
          <p style={{ paddingLeft: 95, fontFamily: 'Lato', fontSize: 20 }}>{projects ? `Explore ${projects.length} ${projects.length > 1 ? 'proposals' : 'proposal'}` : null}</p>
          <Button style={{ color: 'black', marginRight: 25, border: '1px solid black', borderRadius: 4, fontFamily: font1, fontSize: 12 }}>
            Map
            <img style={{ marginLeft: 5 }}src={mapicon} alt='map' />
          </Button>
        </div>
        <div style={{ marginLeft: 85, marginRight: 25 }}>
          <Row gutter={gutter}>
            {projects}
          </Row>
        </div>
      </div>
      <div style={{ marginLeft: 60, marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    </div>
  )
}
