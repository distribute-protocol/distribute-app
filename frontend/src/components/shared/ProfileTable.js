import React from 'react'
import { Table, Button, Input } from 'antd'
import { css } from 'react-emotion'

const tableCSS = css({
  'thead': {
    fontSize: 18,
    fontFamily: 'Lato',
    fontWeight: 700
  },
  'td': {
    fontSize: 14,
    fontFamily: 'NowAltRegular',
    backgroundColor: 'rgba(218, 218, 218, 0.5)'
  }
})

class ProfileTable extends React.Component {
  render () {
    let data
    if (this.props.input !== null && this.props.input.length !== 0) {
      data = this.props.input.map((datum, i) => {
        return {
          key: i,
          address: datum,
          close: <Button onClick={() => this.props.deleteItem(i)} style={{ cursor: 'pointer' }} shape='circle' icon='close' />
        }
      })
    } else {
      data = []
    }
    return (
      <div style={{ width: 250 }}>
        <Table
          dataSource={data}
          className={this.props.tableCSS}
          pagination={false}
          locale={{ emptyText: null }}
        >
          <Table.Column
            title={this.props.title}
            dataIndex='address'
            key='address'
          />
          <Table.Column
            title={null}
            dataIndex='close'
            key='close'
          />
        </Table>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Button onClick={() => { this.props.addItem(this.state.value, this.props.datakey); this.state.target.value = '' }} style={{ cursor: 'pointer', display: 'flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }} icon='plus' />
          <Input style={{ marginLeft: 5 }} onChange={(e) => { this.setState({ value: e.target.value, target: e.target }) }} placeholder={this.props.add} />
        </div>
      </div>
    )
  }
}

export default ProfileTable
// <p style={{paddingLeft: 13, paddingTop: 19, fontSize: 14, fontFamily: 'NowAltRegular'}}>{add}</p>
