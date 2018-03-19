import React from 'react'
import { Button, Table } from 'antd'
import ProjectHeader from '../shared/ProjectHeader'
import DraggableTable from '../shared/DraggableTable'

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
}, {
  title: '',
  dataIndex: 'deleteTask',
  key: 'deleteTask'
}]

const submissionColumns = [{
  title: 'Submitter',
  dataIndex: 'submitter',
  key: 'submitter'
}, {
  title: 'Submission',
  dataIndex: 'submission',
  key: 'submission'
}, {
  title: 'Weighting',
  dataIndex: 'weighting',
  key: 'weighting'
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
  submission,
  tasks,
  submitTaskList,
  checkActive,
  submissionTasks,
  moveRow
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
            Task Submission Expiration<strong> {typeof date !== 'undefined' ? `${date.fromNow()}` : 'N/A'}</strong>
          </div>
          {submission}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
          <DraggableTable address={address} data={tasks} columns={columns} moveRow={moveRow} />
        </div>
        <Button style={{marginTop: 10}} onClick={() => submitTaskList()}>Submit Tasks</Button>
        <div>
          <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
            <Table style={{backgroundColor: '#ffffff'}} dataSource={submissionTasks} columns={submissionColumns} pagination={false} />
          </div>
        </div>
        {/* disabled={Date.now() < date.valueOf()} */}
        <Button style={{margin: 20}} onClick={() => checkActive()} >Check Active</Button>
      </div>
    </div>
  )
}
