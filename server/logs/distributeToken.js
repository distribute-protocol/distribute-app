const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'))
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const DT = require('../../frontend/src/abi/DistributeToken')
const assert = require('assert')

const Network = require('../models/network')
const User = require('../models/user')

module.exports = function () {
  // setup --> check to make sure filter running appropriately by logging ganache accounts
  eth.accounts().then(accountsArr => {
    console.log('accountsArr:', accountsArr)
  })

  // initialize network model --> ONLY DO THIS ONCE
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
    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalTokens += tokensMinted
      // netStatus.currentPrice
      netStatus.save((err) => {
        if (err) throw Error
        console.log('mintevent: netStatus updated')
      })
    })

    User.findOne({account: account}).exec((err, userStatus) => {
      if (err) throw Error
      userStatus.tokenBalance += tokensMinted
      // add time from filter block number
      userStatus.mintEvents.push({quantity: tokensMinted})
      userStatus.save((err) => {
        if (err) throw Error
        console.log('mint event: userStatus updated')
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
    account = '0x' + account.substr(-40)
    let tokensBurned = eventParamArr[0]
    // convert result from hex to decimal
    tokensBurned = -1 * parseInt(tokensBurned, 16)
    // update user balance
    // update total balance (network)
    // update currentPrice
    // want a history of this (so user can have a log of mint/sell)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalTokens += tokensBurned
      // netStatus.currentPrice
      netStatus.save((err) => {
        if (err) throw Error
        console.log('sell event: netStatus updated')
      })
    })

    User.findOne({account: account}).exec((err, userStatus) => {
      if (err) throw Error
      userStatus.tokenBalance += tokensBurned
      // add time from filter block number
      userStatus.mintEvents.push({quantity: tokensBurned})
      userStatus.save((err) => {
        if (err) throw Error
        console.log('sell event: userStatus updated')
      })
    })
  })
}
