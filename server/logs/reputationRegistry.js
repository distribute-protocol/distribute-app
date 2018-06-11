const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const RR = require('../../frontend/src/abi/ReputationRegistry')

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

    User.findOne({account: account}).exec((err, userStatus) => {
      console.log(account)
      if (err) throw Error
      userStatus.reputationBalance += 10000
      userStatus.save(err => {
        if (err) throw Error
        console.log('user registerd')
      })
    })

    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalReputation += 10000
      netStatus.save(err => {
        if (err) throw Error
        console.log('network updated w/user registered')
      })
    })
  })

  const proposeProjectFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3]('ProjectCreated(address)')
  })

  proposeProjectFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let eventParams = result.topics[1] // WHAT IS THIS DOOING
    let account = '0x' + eventParams.substr(-40)

    User.findOne({account: account}).exec((err, userStatus) => {
      console.log(account)
      if (err) throw Error
      userStatus.reputationBalance -= 0.05 * reputationCost
      userStatus.save(err => {
        if (err) throw Error
        console.log('project proposed by reputation holder')
      })
    })

    Project.findOne({}).exec(err, projectStatus) => {   // where is projectStatus coming from?
      if (err) throw Err
      projectStatus.state = 1,
      projectStatus.weiCost += projectCost,
      projectStatus.proposer =  proposer,
      projectStatus._id = projectAddress,
      projectStatus.proposerStake = collateral,
      projectStatus.proposerType = 'reputation'
      projectStatus.save(err => {
        if (err) throw Error
        console.log('project details updated')
    })
  })
}
