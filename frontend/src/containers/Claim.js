import React from 'react'
import DraggableTable from '../components/shared/DraggableTable'

class Claim extends React.Component {
  render () {

    const columns = [{
      title: 'Task Description',
      dataIndex: 'description',
      key: 'description'
    }, {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage'
    }, {
      title: 'ETH Reward',
      dataIndex: 'ethReward',
      key: 'ethReward'
    }]

    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          <h3 className='App-title'>Figuring out Draggable Table</h3>
        </header>
        <DraggableTable columns={columns} />
      </div>
    )
  }
}

export default Claim
