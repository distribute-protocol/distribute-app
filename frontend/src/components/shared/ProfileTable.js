import React from 'react'
import { Table } from 'antd'
import plusbutton from '../../images/plusbutton.svg'

export default ({
  title,
  input,
  add
}) => {
  return (
    <div style={{width: 240}}>
      <Table style={{fontSize: 25}} dataSource={[{
        key: '1',
        address: input
      }]}>
        <Table.Column
          title={title}
          dataIndex='address'
          key='address'
        />
      </Table>
      <div style={{display: 'flex', alignItems: 'center', fontSize: 20, fontFamily: 'NowAltRegular'}}>
        <img src={plusbutton} alt='add avatar' />
        <p style={{paddingLeft: 8}}>{add}</p>
      </div>
    </div>
  )
}
