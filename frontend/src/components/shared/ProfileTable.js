import React from 'react'
import { Table } from 'antd'
import plusbutton from '../../images/plusbutton.svg'
import { css } from 'react-emotion'

const tableCSS = css({
  'thead': {
    fontSize: 20,
    fontFamily: 'Lato',
    fontWeight: 'bold'
  },
  'td': {
    fontSize: 16,
    fontFamily: 'NowAltRegular',
    backgroundColor: 'rgba(218, 218, 218, 0.5)'
  }
})

export default ({
  title,
  input,
  add
}) => {
  return (
    <div style={{width: 240}}>
      <Table
        style={{fontSize: 25}}
        dataSource={[{
          key: '1',
          address: input
        }]}
        className={tableCSS}
        pagination={false}
      >
        <Table.Column
          title={title}
          dataIndex='address'
          key='address'
        />
      </Table>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img src={plusbutton} alt='add avatar' />
        <p style={{paddingLeft: 8, paddingTop: 19, fontSize: 16, fontFamily: 'NowAltRegular'}}>{add}</p>
      </div>
    </div>
  )
}
