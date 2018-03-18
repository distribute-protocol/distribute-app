import React from 'react'
import ProjectHeader from '../shared/ProjectHeader'
import { Button, Table } from 'antd'

const columns = [{
  title: 'Task Description',
  dataIndex: 'description',
  key: 'description'
}, {
  title: 'ETH Reward',
  dataIndex: 'ethReward',
  key: 'ethReward'
}, {
  title: '',
  dataIndex: 'input',
  key: 'input'
}]

export default ({
  name,
  address,
  photo,
  summary,
  location,
  cost,
  reputationCost,
  date,
  tasks,
  checkVoting
}) => {
  return (
    <div>
      <ProjectHeader
        name={name}
        address={address}
        photo={photo}
        summary={summary}
        location={location}
        cost={cost}
        reputationCost={reputationCost}
      />
      <div>
        <div>
          Validate Period Expires In {typeof date !== 'undefined' ? `${date.fromNow()}` : 'N/A'}
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
        <Table dataSource={tasks} columns={columns} pagination={false} />
      </div>
      <Button
        style={{marginTop: 30}}
        onClick={() => checkVoting()}>
          Check Voting
      </Button>
    </div>
  )
}
