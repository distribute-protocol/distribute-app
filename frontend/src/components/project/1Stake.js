import React from 'react'
import { Button } from 'antd'
import ProjectHeader from '../shared/ProjectHeader'
import ButtonStakeProject from '../../contractComponents/buttons/StakeProject'
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
                <Button style={{backgroundColor: '#1FA9FF', color: 'white'}} icon='down-circle-o' color='primary' onClick={() => tokens(false)}>
                  Tokens
                </Button>
                <Button style={{backgroundColor: '#0BA16D', color: 'white'}} icon='down-circle-o' color='primary' onClick={() => reputation(false)}>
                  Reputation
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
