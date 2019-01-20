import React from 'react'
import { Button, Col, Row, Pagination } from 'antd'
import ProjectCard from './ProjectCard'
import mapicon from '../../images/mapicon.svg'
import lightning from '../../images/lightning.svg'
import { font1 } from '../../styles/fonts'

export default (
  props
) => {
  const projects = typeof props.projectData !== `undefined`
    ? Object.keys(props.projectData).map((address, i) => {
      return <Col key={i} index={i} span={6} style={{ marginBottom: 32 }}>
        <ProjectCard
          project={props.projectData[address]} ethPrice={props.ethPrice} redirect={props.redirect} />
      </Col>
    })
    : null
  const gutter = { xs: 8, sm: 16, md: 24, lg: 32 }
  return (
    <div style={{ height: '80%', flex: 1, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
      <div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', color: 'black' }}>
          <p style={{ paddingLeft: 95, fontFamily: 'Lato', fontSize: 20 }}>{projects ? `${projects.length} ${projects.length > 1 ? 'proposals' : 'proposal'}` : `0 proposals`}</p>
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
        {projects
          ? null
          : <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', alignSelf: 'center', marginTop: '7%', marginLeft: 60 }}>
            <img src={lightning} alt='lightning' />
            <div style={{ marginTop: 60, fontFamily: font1, fontSize: 24 }}>
              {props.nullText}
            </div>
            <Button style={{ marginTop: 40, width: 180, height: 50, fontFamily: font1, fontSize: 24 }} onClick={() => props.redirect('/initiator', {})}>
              {props.nullAction}
            </Button>
          </div>
        }
      </div>
      <div style={{ marginLeft: 60, marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    </div>
  )
}
