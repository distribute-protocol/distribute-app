import React from 'react'
import { Card } from 'antd'

export default (
  project
) => {
  return (
    <Card style={{height: 200}}>
      {project.project.name}
    </Card>
  )
}
