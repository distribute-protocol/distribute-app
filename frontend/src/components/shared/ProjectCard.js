import React from 'react'
import { Card } from 'antd'
import fillercardimage from '../../images/fillercardimage.svg'

export default (
  project
) => {
  let image
  project.project.image !== undefined
    ? image = project.project.image
    : image = fillercardimage
  return (
    <Card
      hoverable
      bordered={false}
      style={{height: 200, backgroundImage: `url(${image})`}}
    >
      <b><p style={{fontFamily: 'Lato', color: 'white', fontSize: 20, marginTop: 130, marginLeft: 10}}>{project.project.name}</p></b>
    </Card>
  )
}
