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
  title: 'Reward Validator?',
  dataIndex: 'rewardValidator',
  key: 'rewardValidator'
}, {
  title: 'Reward Worker?',
  dataIndex: 'rewardWorker',
  key: 'rewardWorker'
}, {
  title: 'Task Needs Vote?',
  dataIndex: 'taskNeedsVote',
  key: 'taskNeedsVote'
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
  checkEnd
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
          Voting Period Expires In {typeof date !== 'undefined' ? `${date.fromNow()}` : 'N/A'}
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
        <Table dataSource={tasks} columns={columns} />
      </div>
      <Button
        onClick={() => checkEnd()}>
        Check End
      </Button>
    </div>
  )
}
