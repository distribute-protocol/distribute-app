import React from 'react'
import { Button } from 'antd'
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
  tokens,
  reputation,
  checkStaked
}) => {
  return (
    <div style={{backgroundColor: '#DDE4E5', marginTop: 30}}>
      <div style={{padding: 10}}>
        <h3>{name}</h3>
      </div>
      <div style={{padding: 10, paddingTop: 0}}>
        <div style={{wordWrap: 'break-word'}}>{`Address: ${address}`}</div>
        { typeof photo !== 'undefined'
          ? <img style={{height: 200, width: 200}} src={photo} />
          : null
        }
        <div>Summary: {`${summary}`}</div>
        <div>Location: {`${location}`}</div>
        <div>Cost: {`${cost} ETH`}</div>
        <div>Reputation Cost: {`${reputationCost}`}</div>
        <div>Tokens Remaining: {`${tokensLeft}`}</div>
        <div>Reputation Remaining {`${reputationCost - totalReputationStaked}`}</div>
        <div>Expiration: {typeof date !== 'undefined' ? `${date.fromNow()}` : 'N/A'}</div>
        <div style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
          {stakeInput}
          <div>
            <div>
              <ButtonGroup>
                <Button
                  style={{backgroundColor: '#0B1899', color: 'white'}}
                  icon='up-circle-o'
                  color='primary'
                  onClick={() => tokens(true)}>
                  Tokens
                </Button>
                <Button
                  style={{backgroundColor: '#08734E', color: 'white'}}
                  icon='up-circle-o'
                  color='primary'
                  onClick={() => reputation(true)}>
                  Reputation
                </Button>
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
        <Button onClick={() => checkStaked()}>
          Check Staked
        </Button>
      </div>
    </div>
  )
}
