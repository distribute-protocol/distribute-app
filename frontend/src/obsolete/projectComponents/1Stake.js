import React from 'react'
import { Button } from 'antd'
import ProjectHeader from '../shared/ProjectHeader'
import ButtonStakeProject from '../../contractComponents/stage1/StakeProject'
import ButtonUnstakeProject from '../../contractComponents/stage1/UnstakeProject'
import ButtonCheckStaked from '../../contractComponents/stage1/CheckStaked'
const ButtonGroup = Button.Group

export default ({
  name,
  address,
  photo,
  summary,
  location,
  cost,
  tokensLeft,
  reputationCost,
  totalReputationStaked,
  date,
  stakeInput,
  user,
  value,
  tokens,
  reputation
}) => {
  return (
    <div style={{backgroundColor: '#DDE4E5', marginTop: 30}}>
      <ProjectHeader
        name={name}
        address={address}
        photo={photo}
        summary={summary}
        location={location}
        cost={cost}
        reputationCost={reputationCost}
      />
      <div style={{padding: 10, paddingTop: 0}}>
        <div>{`Tokens Remaining: ${tokensLeft}`}</div>
        <div>Reputation Remaining: {`${reputationCost - totalReputationStaked}`}</div>
        <div>Expiration: {typeof date !== 'undefined' ? `${date.fromNow()}` : 'N/A'}</div>
        <div style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
          {stakeInput}
          <div>
            <div>
              <ButtonGroup>
                <ButtonStakeProject
                  address={address}
                  type='tokens'
                  user={user}
                  val={value}
                />
                <ButtonStakeProject
                  address={address}
                  type='reputation'
                  user={user}
                  val={value}
                />
              </ButtonGroup>
            </div>
            <div style={{marginTop: 5}}>
              <ButtonGroup>
                <ButtonUnstakeProject
                  address={address}
                  type='tokens'
                  user={user}
                  val={value}
                />
                <ButtonUnstakeProject
                  address={address}
                  type='reputation'
                  user={user}
                  val={value}
                />
              </ButtonGroup>
            </div>
          </div>
        </div>
        <ButtonCheckStaked
          address={address}
          user={user}
        />
      </div>
    </div>
  )
}
