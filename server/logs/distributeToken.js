const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'))
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const DT = require('../../frontend/src/abi/DistributeToken')
const fetch = require('node-fetch')
const assert = require('assert')

const Network = require('../models/Network')
const User = require('../models/User')

module.exports = function () {
  // setup
  eth.accounts().then(accountsArr => {
    console.log('accountsArr:', accountsArr)
  })

  let network = new Network({
    totalTokens: 0,
    totalReputation: 0,
    currentPrice: 0,
    ethPrice: 0,
    weiBal: 0
  })

  network.save((err) => {
    assert.equal(err, null)
  })

  // filter for minting events
  const mintFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: DT.DistributeTokenAddress,
    topics: [web3.sha3('LogMint(uint256,uint256,address)')]
  })

  mintFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let account = eventParamArr[2]
    account = '0x' + account.substr(-40)
    let tokensMinted = eventParamArr[0]
    // convert result from hex to decimal
    tokensMinted = parseInt(tokensMinted, 16)
    // update user balance
    // update total balance (network)
    // update currentPrice
    // want a history of this (so user can have a log of mint/sell)
    // await fetch(`${serverUrl}/api/mint?account=${account}&value=${tokensMinted}`, config)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalTokens += tokensMinted
      // netStatus.currentPrice
      netStatus.save((err) => {
        if (err) throw Error
        console.log('netStatus updated')
      })
    })

    User.findOne({account: account}).exec((err, userStatus) => {
      if (err) throw Error
      userStatus.tokenBalance += tokensMinted
      // add time from filter block number
      userStatus.mintEvents.push({quantity: tokensMinted})
      userStatus.save((err) => {
        if (err) throw Error
        console.log('userStatus updated')
      })
    })
  })

  // filter for selling events
  const sellFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: DT.DistributeTokenAddress,
    topics: [web3.sha3('LogWithdraw(uint256,uint256,address)')]
  })

  sellFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let account = eventParamArr[2]
    // console.log(account, typeof account)
    account = '0x' + account.substr(-40)
    // console.log(account)
    let tokensBurned = eventParamArr[0]
    // convert result from hex to decimal
    tokensBurned = -1 * parseInt(tokensBurned, 16)
    // console.log(tokensMinted)
    let config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    await fetch(`${serverUrl}/api/mint?account=${account}&value=${tokensBurned}`, config)
  })
}
