import React from 'react'
import { Table } from 'antd'

const columns = [{
  title: 'Validators',
  dataIndex: 'address',
  key: 'address'
}, {
  title: 'Amount of Tokens',
  dataIndex: 'amount',
  key: 'amount'
}, {
  title: 'Validation State',
  dataIndex: 'state',
  key: 'state'
}]

export default ({
  validations
}) => {
  return (
    <div style={{backgroundColor: '#DDE4E5', marginBottom: 30}}>
      <Table dataSource={validations} columns={columns} pagination={false} />
    </div>
  )
}
