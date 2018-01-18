import React, { Component } from 'react'
import { getEthPriceNow } from 'get-eth-price'
import { Button } from 'reactstrap'
import {eth, web3, tr, rr, dt} from '../utilities/blockchain'

// import uport from '../utilities/uport'
// var mnid = require('mnid')

// let uportWR = uport.contract(JSON.parse(ReputationRegistryABI)).at(ReputationRegistryAddress)
// window.uportWR = uportWR
class Status extends Component {
  constructor () {
    super()
    this.state = {
      value: 0
    }
    this.buyShares = this.buyShares.bind(this)
    this.sellShares = this.sellShares.bind(this)
    this.getBalance = this.getBalance.bind(this)
    this.queryUserBalance = this.queryUserBalance.bind(this)
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    window.tr = tr
    window.rr = rr
  }
  login () {
    // uport.requestCredentials({
    //   requested: ['name', 'avatar'],
    //   notifications: true
    // }).then((credentials) => {
    //   console.log(credentials)
    //   // console.log(mnid.decode(credentials.address))
    //   this.uportWR.register()
    //   // https://rinkeby.infura.io/11XiCuI1EjsowYvplZ24
    //   // const txobject = {
    //   //   to: '0xeec918d74c746167564401103096d45bbd494b74',
    //   //   function: WR.register(),
    //   //   appName: 'Nemo'
    //   // }
    //   // uport.sendTranaction(txobject).then(txID => console.log(txID))
    //   // WR.register()
    // })
  }
  componentWillMount () {
    // let config = {
    //   method: 'GET',
    //   headers: new Headers(),
    //   mode: 'cors',
    //   cache: 'default'
    // }
    // fetch('/api', config).then((res, req) => {})
    // this.queryDatabaseTest()
    this.getBalance()
  }

/// ///////  DATABASE TESTING  ///////////

  // queryDatabaseTest () {
  //   let config = {
  //     method: 'GET',
  //     headers: new Headers(),
  //     mode: 'cors',
  //     cache: 'default'
  //   }
  //   fetch(`/api/databasetest`, config)
  //   .then(response => response.json())
  //   .then(text => {
  //     if (text.length != 0) {
  //       console.log(text)
  //       this.setState({databaseTest: text[text.length - 1].value})
  //     }
  //   })
  // }
  // postDatabaseTest (value) {
  //   console.log('post')
  //   let config = {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   }
  //   fetch(`/api/databasetest?value=${value}`, config)
  //   .then((val) => {
  //     console.log('post response', val)
  //   })
  // }

  async getBalance () {
    try {
      let accounts = await eth.accounts
      // console.log(accounts[0])
      // let balance = (await this.queryUserBalance())
      let ethPrice = await getEthPriceNow()
      ethPrice = ethPrice[Object.keys(ethPrice)].ETH.USD
      let balance,
        totalTokenSupply,
        totalFreeTokenSupply,
        weiBal,
        reputationBalance,
        totalReputationSupply,
        totalFreeReputationSupply,
        currentPrice
      // let balance = (await dt.balanceOf(accounts[0]))[0].toNumber()
      await dt.balanceOf(accounts[0], (err, val) => {
        if (!err) {
          balance = val.toNumber()
        }
      })
      await dt.totalSupply((err, val) => {
        if (!err) {
          totalTokenSupply = val.toNumber()
        }
      })
      await dt.totalFreeSupply((err, val) => {
        if (!err) {
          totalFreeTokenSupply = val.toNumber()
        }
      })
      await dt.weiBal((err, val) => {
        if (!err) {
          weiBal = web3.fromWei(val.toNumber(), 'ether')
        }
      })
      await rr.balances(accounts[0], (err, val) => {
        if (!err) {
          reputationBalance = val.toNumber()
        }
      })
      await rr.totalSupply(accounts[0], (err, val) => {
        if (!err) {
          totalReputationSupply = val.toNumber()
        }
      })
      await rr.totalFreeSupply(accounts[0], (err, val) => {
        if (!err) {
          totalFreeReputationSupply = val.toNumber()
        }
      })

      // let  = (await dt.totalFreeSupply())[0].toNumber()
      // let = web3.fromWei((await dt.weiBal())[0], 'ether')
      // let weiBal = (await dt.weiBal())[0].toString()

      // let  = (await rr.balances(accounts[0]))[0].toNumber()
      // let  = (await rr.totalSupply())[0].toNumber()
      // let  = (await rr.totalFreeSupply())[0].toNumber()
      await dt.currentPrice((err, val) => {
        if (!err) {
          currentPrice = val.toNumber()
          this.setState({
            totalTokenSupply,
            balance,
            ethPrice,
            weiBal,
            totalFreeTokenSupply,
            totalReputationSupply,
            totalFreeReputationSupply,
            reputationBalance,
            currentPrice: web3.fromWei(currentPrice, 'ether')
          })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  buyShares () {
    let accounts = eth.accounts
    dt.mint(this.tokensToBuy.value, {value: web3.toWei(30, 'ether'), from: accounts[0]}, (err, result) => {
      if (!err) {
        this.getBalance()
      }
    })
  }
  // model db calls after this function
  async queryUserBalance () {
    try {
      let config = {
        method: 'GET',
        headers: new Headers(),
        mode: 'cors',
        cache: 'default'
      }
      let response = await fetch(`/api/userbalance`, config)
      response = await response.json()
      if (response.length === 0) {
        return 0
      }
      response = response[response.length - 1].value      // to be changed based on db things
      console.log(response)
      return response
    } catch (error) {
      throw new Error(error)
    }
  }

  sellShares () {
    eth.getAccounts().then((err, accountsArr) => {
      if (!err) {
        dt.burnAndRefund(this.tokensToBuy.value, {from: accountsArr[0]})
        this.getBalance()
      }
    })
  }

  register () {
    let accounts = eth.accounts
    rr.register({from: accounts[0]}, (err, result) => {
      if (!err) {
        console.log('yayyyyy')
      }
    })
  }

  async onChange (val) {
    if (val > 0) {
      try {
        let ethRequired, totalSupply, refund
        await dt.weiRequired(val, (err, result) => {
          if (!err) {
            ethRequired = web3.fromWei(result.toNumber(), 'ether')
          }
        })
        await dt.totalSupply((err, result) => {
          if (!err) {
            totalSupply = result.toNumber()
          }
        })
        if (totalSupply === 0) {
          refund = ethRequired
        } else {
          await dt.weiBal((err, result) => {
            if (!err) {
              refund = web3.fromWei((result.toNumber() / totalSupply * val), 'ether')
            }
          })
        }
        this.setState({ethToSend: ethRequired, ethToRefund: refund})
      } catch (error) {
        throw new Error(error)
      }
    }
  }
  render () {
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          {/* <img src={logoclassName='App-logo' alt='logo' /> */}
          <h1 className='App-title'>distribute</h1>
        </header>
        <Button onClick={this.login} style={{marginLeft: 20, backgroundColor: 'purple'}}>
          Connect with uPort
        </Button>
        <div style={{marginLeft: 20, marginTop: 40, display: 'flex', justifyContent: 'flex-start'}}>
          <div>
            <h3>Total Token Supply</h3>
            <h5>{this.state.totalTokenSupply}</h5>
            <h3>Total Free Token Supply</h3>
            <h5>{this.state.totalFreeTokenSupply}</h5>
            <h3>Your Token Balance</h3>
            <h5>{this.state.balance}</h5>
            <h3>Controlled Market Percentage</h3>
            <h5>{Math.round(this.state.balance / this.state.totalTokenSupply * 10000) / 100}%</h5>
            <h3>Eth Pool</h3>
            <h5>{this.state.weiBal} ETH</h5>
            <h3>Capital Equivalent</h3>
            <h5>{`$${this.state.ethPrice ? Math.round(this.state.ethPrice * this.state.weiBal) * 100 / 100 : 0}`}</h5>
            <h3>Current Token Price in Eth</h3>
            <h5>{this.state.currentPrice}</h5>
          </div>
          <div style={{marginLeft: 25}}>
            <h3>Total Reputation Supply</h3>
            <h5>{this.state.totalReputationSupply}</h5>
            <h3>Total Free Reputation Supply</h3>
            <h5>{this.state.totalFreeReputationSupply}</h5>
            <h3>Reputation Balance</h3>
            <h5>{this.state.reputationBalance}</h5>
          </div>
          {/*
          <div style={{marginLeft: 25}}>
            <h3>Database Test</h3>
            <h5>{this.state.databaseTest}</h5>
            <div style={{marginTop: 20}}>
              <Button color='primary' onClick={() => this.postDatabaseTest(Date.now())}>
                DatabaseTest
              </Button>
            </div>
          </div>
          */}
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div>
            {/* <Input getRef={(input) => (this.location = input)}  onChange={(e) => this.onChange('location', this.location.value)} value={location || ''} /> */}
            <div>
              <h3>Tokens:</h3>
              <input ref={(input) => (this.tokensToBuy = input)} placeholder='Number of Tokens' onChange={(e) => this.onChange(this.tokensToBuy.value)} value={this.state.tokensToBuy} type='number' />
            </div>
            <div style={{marginTop: 20}}>
              <h4>{`Cost to Buy: ${typeof this.state.ethToSend === 'undefined' ? 'n/a' : Math.round(this.state.ethToSend * 100000) / 100000} ETH`}</h4>

            </div>
            <div>
              <h4>{`Refund Amount: ${typeof this.state.ethToRefund === 'undefined' ? 'n/a' : Math.round(this.state.ethToRefund * 100000) / 100000} ETH`}</h4>
            </div>
            <div style={{marginTop: 20}}>
              <Button color='primary' onClick={this.buyShares}>
                Buy
              </Button>
              <Button color='warning' onClick={this.sellShares} style={{marginLeft: 10}}>
                Sell
              </Button>
              <Button color='info' onClick={this.getBalance} style={{marginLeft: 10}}>
                Refresh Balances
              </Button>
              {this.state.reputationBalance < 1 ? <Button color='success' onClick={this.register} style={{marginLeft: 10}}>
                Register
              </Button> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Status
