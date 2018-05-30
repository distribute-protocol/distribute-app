const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const RR = require('../../frontend/src/abi/ReputationRegistry')
const assert = require('assert')

const mongoose = require('mongoose')
const Network = require('../models/network')
const User = require('../models/user')

module.exports = function () {
  // filter for register events
  const registerFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogRegister(address)')]
  })

  registerFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let eventParams = result.topics[1]
    let account = '0x' + eventParams.substr(-40)

    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      tokenBalance: 0,
      reputationBalance: 10000,
      account: account,
      // figure out how to get uPort credentials here (do we even need these rn?)
      // credentials: req.body,
      projects: {proposed: [], staked: [], active: [], validating: [], voting: [], complete: [], failed: [], expired: []},
      // figure out how to define objects in an array for the mint events to be of a certain type
      // maybe write schema for that separately - time, quantity, etc
      mintEvents: []
    })
    user.save((err, user) => {
      assert.equal(err, null)
      console.log('user registered & inserted')
    })

    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalReputation += 10000
      netStatus.save((err) => {
        if (err) throw Error
        console.log('netStatus updated')
      })
    })
  })
}
