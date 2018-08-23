import React from 'react'
import ProjectHeader from '../shared/ProjectHeader'
import ButtonSubmitFinalTaskList from '../../contractComponents/buttons/SubmitFinalTaskList'
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
  title: 'Rep to Claim',
  dataIndex: 'repClaim',
  key: 'repClaim'
}, {
  title: '',
  dataIndex: 'buttons',
  key: 'buttons'
}]

export default ({
  name,
  address,
  photo,
  user,
  summary,
  location,
  cost,
  reputationCost,
  date,
  tasks,
  checkValidateStatus
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
            Task Completion Expiration: {typeof date !== 'undefined' ? `${date.fromNow()}` : 'N/A'}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
          <Table dataSource={tasks} columns={columns} pagination={false} />
        </div>
      </div>
      <div style={{margin: 20}}>
        <ButtonSubmitFinalTaskList
          address={address}
          user={user}
        />
        <Button onClick={() => checkValidateStatus()}>
          Check Validate
        </Button>
      </div>
    </div>
  )
}
