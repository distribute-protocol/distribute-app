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
  checkVotingStatus
}) => {
  return (
    <div style={{backgroundColor: '#DDE4E5', marginBottom: 30}}>
      <ProjectHeader
        name={name}
        address={address}
        photo={photo}
        summary={summary}
        location={location}
        cost={cost}
        reputationCost={reputationCost}
      />
      <div style={{padding: 10}}>
        <div>
          <div>
            Validate Period Expires In {typeof date !== 'undefined' ? `${date.fromNow()}` : 'N/A'}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
          <Table dataSource={tasks} columns={columns} pagination={false} />
        </div>
      </div>
      <Button
        style={{margin: 20}}
        onClick={() => checkVotingStatus()}>
          Check Voting
      </Button>
    </div>
  )
}
