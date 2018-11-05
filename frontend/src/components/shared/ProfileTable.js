import React from 'react'
import { Table, Button } from 'antd'
// import plusbutton from '../../images/plusbutton.svg'
import { css } from 'react-emotion'

const tableCSS = css({
  'thead': {
    fontSize: 18,
    fontFamily: 'Lato'
  },
  'td': {
    fontSize: 14,
    fontFamily: 'NowAltRegular',
    backgroundColor: 'rgba(218, 218, 218, 0.5)'
  }
})

export default ({
  title,
  input,
  add,
  deleteItem,
  addItem
}) => {
  let data
  if (input !== null && input.length !== 0) {
    data = input.map((datum, i) => {
      return {
        key: i,
        address: datum,
        close: <Button onClick={(i) => deleteItem(i)} style={{cursor: 'pointer'}} shape='circle' icon='close' />
      }
    })
  } else {
    data = []
  }
  return (
    <div style={{width: 250}}>
      <Table
        dataSource={data}
        className={tableCSS}
        pagination={false}
      >
        <Table.Column
          title={title}
          dataIndex='address'
          key='address'
        />
        <Table.Column
          title={null}
          dataIndex='close'
          key='close'
        />
      </Table>
      <div style={{display: 'flex', alignItems: 'center', paddingLeft: 5}}>
        { /* // <img onClick={addItem} style={{paddingLeft: 5, cursor: 'pointer'}} src={plusbutton} alt='add avatar' /> */ }
        <Button onClick={() => addItem()} style={{cursor: 'pointer'}} shape='circle' icon='plus' />
        <p style={{paddingLeft: 13, paddingTop: 19, fontSize: 14, fontFamily: 'NowAltRegular'}}>{add}</p>
      </div>
    </div>
  )
}
