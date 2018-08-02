const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PL = require('../../frontend/src/abi/ProjectLibrary')
const Project = require('../models/project')
const Task = require('../models/task')
const Network = require('../models/network')

module.exports = function () {
  // filter for tasks validated, no vote needed
  const taskValidatedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PL.projectLibraryAddress,
    topics: [web3.sha3('LogTaskValidated(address,address,bool)')]
  })
  taskValidatedFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let taskAddress = eventParamArr[0]
    taskAddress = '0x' + taskAddress.substr(-40)
    let projectAddress = eventParamArr[1]
    projectAddress = '0x' + projectAddress.substr(-40)
    let confirmation = eventParamArr[2]
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
      }
      Project.findOne({address: projectAddress}).exec((err, doc) => {
        if (err) console.error(err)
        if (doc) {
          doc.state = 5
          doc.save(err => {
            if (err) console.error(err)
            console.log('project in voting stage')
          })
          Task.findOne({address: taskAddress}).exec((err, task) => {
            if (err) console.error(err)
            if (confirmation === '0000000000000000000000000000000000000000000000000000000000000001') {
              task.confirmation = true
              task.workerRewardClaimable = true
              task.validationRewardClaimable = true
              task.save(err => {
                if (err) console.error(err)
                console.log('task successfully validated yes')
              })
            } else {
              task.confirmation = false
              task.workerRewardClaimable = false
              task.validationRewardClaimable = true
              task.save(err => {
                if (err) console.error(err)
                console.log('task successfully validated no')
              })
            }
          })
        }
      })
    })
  })
  const taskVoteFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PL.projectLibraryAddress,
    topics: [web3.sha3('LogTaskVote(address,address,uint)')]
  })
  taskVoteFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let taskAddress = eventParamArr[0]
    taskAddress = '0x' + taskAddress.substr(-40)
    let projectAddress = eventParamArr[1]
    projectAddress = '0x' + projectAddress.substr(-40)
    let pollNonce = parseInt(eventParamArr[2], 16)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
      }
      Project.findOne({address: projectAddress}).exec((err, doc) => {
        if (err) console.error(err)
        doc.state = 5
        doc.save(err => {
          if (err) console.error(err)
          console.log('project in voting stage')
        })
        Task.findOne({address: taskAddress}).exec((err, task) => {
          if (err) console.error(err)
          task.state = 5
          task.pollNonce = pollNonce
          task.save(err => {
            if (err) console.error(err)
            console.log('task completion uncomfirmed, poll created')
          })
        })
      })
    })
  })
}
