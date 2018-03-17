import React from 'react'
import Button from 'antd/lib/button'
import Sidebar from './shared/Sidebar'
const ButtonGroup = Button.Group
export default ({
  totalTokenSupply,
  balance,
  marketPercentage,
  ethPool,
  capitalEquivalent,
  currentPrice,
  totalReputationSupply,
  reputationBalance,
  ethToSend,
  ethToRefund,
  buyShares,
  sellShares,
  input,
  notRegistered,
  register,
  openFaucet,
  faucet,
  onChange
}) => {
  return (
    <div>
      <Sidebar />
      <div style={{marginLeft: 200, flexDirection: 'column', display: 'flex', justifyContent: 'space-between', alignItems: 'space-between'}}>
        <header className='App-header'>
          <h3 className='App-title2'>Network Status</h3>
        </header>
        {/* <Button onClick={this.login} style={{marginLeft: 20, backgroundColor: 'purple'}}>
          Connect with uPort
        </Button> */}
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
            <h5>{`${capitalEquivalent}`}</h5>
            <h3>Current Token Price in Eth</h3>
            <h5>{currentPrice}</h5>
          </div>
          <div style={{marginLeft: 25}}>
            <h3>Total Reputation Supply</h3>
            <h5>{totalReputationSupply}</h5>
            <h3>Reputation Balance</h3>
            <h5>{reputationBalance}</h5>
          </div>
        </div>
        <Button style={{
          marginLeft: 20,
          marginTop: 10,
          width: 160,
          backgroundColor: '#115D8C',
          color: '#FFF'}} icon='reload' color='info' onClick={this.getBalance}>
          Refresh Balances
        </Button>
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
            <div style={{marginTop: 20}}>
              <ButtonGroup>
                <Button icon='plus-circle-o' color='primary' onClick={buyShares}>
                  Buy
                </Button>
                <Button icon='minus-circle-o' color='warning' onClick={sellShares}>
                  Sell
                </Button>
              </ButtonGroup>
            </div>
          </div>
          <div style={{backgroundColor: '#F2A35E', padding: 30}}>
            <div>
              <h3>Reputation:</h3>
            </div>
            <div style={{marginTop: 20}}>
              <ButtonGroup>
                {notRegistered ? <Button color='success' icon='user-add' onClick={register}>
                  Register
                </Button> : null}
                {openFaucet ? <Button icon='download' color='success' onClick={faucet}>
                  Faucet
                </Button> : null}
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
