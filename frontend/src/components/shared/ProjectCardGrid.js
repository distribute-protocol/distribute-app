import React from 'react'
import { Button, Col, Row, Pagination } from 'antd'
import ProjectCard from './ProjectCard'
import mapicon from '../../images/mapicon.svg'

export default () => {
  let gutter = { xs: 8, sm: 16, md: 24, lg: 32 }
  return (
    <div>
      <div style={{marginTop: 20, display: 'flex', justifyContent: 'space-between', color: 'black'}}>
        <p style={{paddingLeft: 95, fontFamily: 'Lato', fontSize: 20}}>Explore 12,367 proposals</p>
        <Button style={{color: 'black', marginRight: 25, border: '1px solid black', borderRadius: 4, fontFamily: 'PingFang SC', fontSize: 12}}>
          Map
          <img style={{marginLeft: 5}}src={mapicon} alt='map' />
        </Button>
      </div>
      <div style={{marginLeft: 85, marginRight: 25}}>
        <Row gutter={gutter}>
          <Col span={6}>
            <ProjectCard title='ProjectCard title' bordered={false}>ProjectCard content</ProjectCard>
          </Col>
          <Col span={6}>
            <ProjectCard title='ProjectCard title' bordered={false}>ProjectCard content</ProjectCard>
          </Col>
          <Col span={6}>
            <ProjectCard title='ProjectCard title' bordered={false}>ProjectCard content</ProjectCard>
          </Col>
          <Col span={6}>
            <ProjectCard title='ProjectCard title' bordered={false}>ProjectCard content</ProjectCard>
          </Col>
        </Row>
        <Row gutter={gutter} style={{marginTop: 32}}>
          <Col span={6}>
            <ProjectCard title='ProjectCard title' bordered={false}>ProjectCard content</ProjectCard>
          </Col>
          <Col span={6}>
            <ProjectCard title='ProjectCard title' bordered={false}>ProjectCard content</ProjectCard>
          </Col>
          <Col span={6}>
            <ProjectCard title='ProjectCard title' bordered={false}>ProjectCard content</ProjectCard>
          </Col>
          <Col span={6}>
            <ProjectCard title='ProjectCard title' bordered={false}>ProjectCard content</ProjectCard>
          </Col>
        </Row>
      </div>
      <div style={{marginLeft: 60, display: 'flex', justifyContent: 'center', marginTop: 35}}>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    </div>
  )
}
