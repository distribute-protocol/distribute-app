import React from 'react'
import { Button } from 'antd'
import ProfileTable from './shared/ProfileTable'
import addavatar from '../images/addavatar.svg'

export default ({
  totalTokenSupply,
  balance,
  marketPercentage,
  ethPool,
  capitalEquivalent,
  currentPrice,
  currentPriceUSD,
  totalReputationSupply,
  reputationBalance,
  ethToSend,
  ethToRefund,
  input,
  user,
  tokensToBuy,
  notRegistered,
  register,
  openFaucet,
  faucet,
  onChange,
  name,
  location
}) => {
  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', paddingTop: 47, paddingLeft: 100}}>
        <div>
          <img src={addavatar} alt='add avatar' />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 20, fontFamily: 'NowAltRegular', paddingLeft: 25, paddingTop: 20}}>
          <p>{name}</p>
          <p>{location}</p>
        </div>
      </div>
      <div style={{display: 'flex', paddingTop: 40}}>
        <div style={{display: 'flex', justifyContent: 'space-between', flexGrow: 3, flexWrap: 'wrap', paddingLeft: 100, paddingRight: 30}}>
          <ProfileTable title={'Expertise / Skills'} input={'Electrical Wiring'} add={'Add Expertise'} />
          <ProfileTable title={'Interests'} input={'Land Trusts'} add={'Add Interest'} />
          <ProfileTable title={'Contact Details'} input={'twitter: @ashokafinley'} add={'Add Contact Details'} />
          <ProfileTable title={'Want To Learn'} input={'electrical wiring'} add={'Add Skills To Learn'} />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, paddingRight: 105}}>
            <p style={{fontSize: 20, fontFamily: 'NowAltRegular'}}>Connections</p>
            <div style={{height: 503, width: 315, backgroundColor: 'rgba(218, 218, 218, 0.5)'}} />
          </div>
        </div>
      </div>
      { /* <div style={{marginLeft: 200, flexDirection: 'column', display: 'flex', justifyContent: 'space-between', alignItems: 'space-between'}}>
        <header className='App-header'>
          <h3 className='App-title2'>Network Status</h3>
        </header>
        <div style={{marginLeft: 20, marginTop: 40, display: 'flex', justifyContent: 'flex-start'}}>
          <div>
            <h3>Total Token Supply</h3>
            <h5>{totalTokenSupply}</h5>
            <h3>Your Token Balance</h3>
            <h5>{balance}</h5>
            <h3>Controlled Market Percentage</h3>
            <h5>{`${marketPercentage}%`}</h5>
            <h3>Eth Pool</h3>
            <h5>{`${ethPool} ETH`}</h5>
            <h3>Capital Equivalent</h3>
            <h5>{`$${capitalEquivalent}`}</h5>
            <h3>Current Token Price</h3>
            <h5>{`${currentPrice} ETH`}</h5>
            <h5>{`$${currentPriceUSD}`}</h5>
          </div>
          <div style={{marginLeft: 25}}>
            <h3>Total Reputation Supply</h3>
            <h5>{totalReputationSupply}</h5>
            <h3>Your Reputation Balance</h3>
            <h5>{reputationBalance}</h5>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', marginTop: 30}}>
          <div style={{backgroundColor: '#C7D9D9', padding: 30, width: 250}}>
            <div>
              <h3>Tokens:</h3>
              {input}
            </div>
            <div style={{marginTop: 20}}>
              <h4>{`Cost to Buy: ${ethToSend} ETH`}</h4>
            </div>
            <div>
              <h4>{`Refund Amount: ${ethToRefund} ETH`}</h4>
            </div>
          </div>
        </div>
      </div> */ }
    </div>
  )
}
