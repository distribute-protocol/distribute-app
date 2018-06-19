const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const mongoose = require('mongoose')

const RR = require('../../frontend/src/abi/ReputationRegistry')

const Network = require('../models/network')
const Stake = require('../models/stake')
const Project = require('../models/project')
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

    User.findOne({account}).exec((err, userStatus) => {
      if (err) throw Error
      if (userStatus && userStatus.reputationBalance === 0) {
        userStatus.reputationBalance += 10000
        userStatus.save(err => {
          if (err) throw Error
          console.log('user registerd')
        })
        Network.findOne({}).exec((err, netStatus) => {
          if (err) throw Error
          if (netStatus) {
            netStatus.totalReputation += 10000
            netStatus.save(err => {
              if (err) throw Error
              console.log('network updated w/user registered')
            })
          }
        })
      }
    })
  })
  // filter for staked reputation
  const stakedReputationFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogStakedReputation(address,uint256,address)')]
  })
  stakedReputationFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let reputationStaked = parseInt(eventParamArr[0], 16)
    let account = eventParamArr[1]
    account = '0x' + account.substr(-40)
    User.findOne({account: account}).exec((err, userStatus) => {
      if (err) console.error(error)
      userStatus.reputationBalance -= reputationStaked
      userStatus.save(err => {
        if (err) console.error(error)
      })
      Project.findOne({address: projectAddress}).exec((error, projectStatus) => {
        if (error) console.error(error)
        let StakeEvent = new Stake({
          _id: new mongoose.Types.ObjectId(),
          amount: reputationStaked,
          projectId: projectStatus.id,
          type: 'reputation',
          userId: userStatus.id
        })
        projectStatus.reputationBalance += reputationStaked
        projectStatus.save((error, saved) => {
          if (error) console.error(error)
        })
        StakeEvent.save((error, saved) => {
          if (error) console.error(error)
          console.log('reputation staked')
        })
      })
    })
  })
  // filter for staked reputation
  const unstakedReputationFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogUnstakedReputation(address,uint256,address)')]
  })
  unstakedReputationFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let reputationStaked = parseInt(eventParamArr[0], 16)
    let account = eventParamArr[1]
    account = '0x' + account.substr(-40)
    User.findOne({account: account}).exec((err, userStatus) => {
      if (err) console.error(error)
      userStatus.reputationBalance += reputationStaked
      userStatus.save(err => {
        if (err) console.error(error)
      })
      Project.findOne({address: projectAddress}).exec((error, projectStatus) => {
        if (error) console.error(error)
        let StakeEvent = new Stake({
          _id: new mongoose.Types.ObjectId(),
          amount: -1 * reputationStaked,
          projectId: projectStatus.id,
          type: 'reputation',
          userId: userStatus.id
        })
        projectStatus.reputationBalance -= reputationStaked
        projectStatus.save((error, saved) => {
          if (error) console.error(error)
        })
        StakeEvent.save((error, saved) => {
          if (error) console.error(error)
          console.log('reputation unstaked')
        })
      })
    })
  })
}
