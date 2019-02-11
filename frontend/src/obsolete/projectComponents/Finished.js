import React from 'react'
import ProjectHeader from '../shared/ProjectHeader'
import { Table } from 'antd'

const columns = [{
  title: 'Task Description',
  dataIndex: 'description',
  key: 'description'
}, {
  title: 'ETH Reward',
  dataIndex: 'ethReward',
  key: 'ethReward'
}, {
  title: 'Reward Validator?',
  dataIndex: 'rewardValidator',
  key: 'rewardValidator'
}, {
  title: 'Reward Worker?',
  dataIndex: 'rewardWorker',
  key: 'rewardWorker'
}, {
  title: 'Rescue Vote?',
  dataIndex: 'rescueVote',
  key: 'rescueVote'
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
  state,
  tasks,
  votes
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
            Voting Period Expires In {typeof date !== 'undefined' ? `${date.fromNow()}` : 'N/A'}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
          <Table dataSource={tasks} columns={columns} pagination={false} />
        </div>
      </div>
      {votes}
    </div>
  )
}
