const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'))
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const DT = require('../../frontend/src/abi/DistributeToken')
const assert = require('assert')
const mongoose = require('mongoose')
const Network = require('../models/network')
const User = require('../models/user')
const Token = require('../models/token')

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
    let tokensMinted = parseInt(eventParamArr[0], 16)
    let weiSpent = parseInt(eventParamArr[1], 16)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalTokens += tokensMinted
      netStatus.weiBal += weiSpent
      netStatus.save((err) => {
        if (err) throw Error
        console.log('mint event: netStatus updated')
      })
    })

    User.findOne({account: account}).exec((err, userStatus) => {
      if (err) throw Error
      let TokenEvent = new Token({
        _id: new mongoose.Types.ObjectId(),
        userId: userStatus.id,
        amount: tokensMinted,
        ether: weiSpent
      })
      TokenEvent.save((err) => {
        if (err) throw Error
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
    let eventParamArr = result.data.slice(2).match(/.{1,64}/g)
    let account = '0x' + eventParamArr[2].substr(-40)
    let tokensBurned = eventParamArr[0]
    let weiWithdrawn = eventParamArr[1]
    // convert result from hex to decimal
    tokensBurned = -1 * parseInt(tokensBurned, 16)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalTokens += tokensBurned
      netStatus.weiBal -= weiWithdrawn
      netStatus.save((err) => {
        if (err) throw Error
        console.log('sell event: netStatus updated')
      })
    })

    User.findOne({account: account}).exec((err, userStatus) => {
      if (err) throw Error
      let TokenEvent = new Token({
        _id: new mongoose.Types.ObjectId(),
        userId: userStatus.id,
        amount: tokensBurned,
        ether: weiWithdrawn
      })
      TokenEvent.save((err) => {
        if (err) throw Error
      })
    })
  })
}
