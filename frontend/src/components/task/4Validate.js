import React from 'react'
import { Table } from 'antd'

const yesColumns = [{
  title: 'Yes Validators',
  dataIndex: 'address',
  key: 'address'
}]

const noColumns = [{
  title: 'No Validators',
  dataIndex: 'address',
  key: 'address'
}]

export default ({
  yesValidations,
  noValidations
}) => {
  return (
    <div style={{backgroundColor: '#DDE4E5', marginBottom: 30}}>
      <Table dataSource={yesValidations} columns={yesColumns} pagination={false} />
      <Table dataSource={noValidations} columns={noColumns} pagination={false} />
    </div>
  )
}
