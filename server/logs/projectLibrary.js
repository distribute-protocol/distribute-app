const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PL = require('../abi/ProjectLibrary')
const Project = require('../models/project')
const Task = require('../models/task')
const Network = require('../models/network')
// const Validation = require('../models/validation')
const User = require('../models/user')

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
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
      }
    })
  })

  const taskVoteFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PL.projectLibraryAddress,
    topics: [web3.sha3('LogTaskVote(address,address,uint256)')]
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
        Project.findOne({address: projectAddress}).exec((err, doc) => {
          if (err) console.error(err)
          if (doc) {
            doc.state = 5
            doc.save(err => {
              if (err) console.error(err)
              console.log('project in voting stage')
            })
          }
          Task.findOne({address: taskAddress}).exec((err, task) => {
            if (err) console.error(err)
            if (task) {
              task.state = 5
              task.pollNonce = pollNonce
              task.save(err => {
                if (err) console.error(err)
                console.log('task completion unconfirmed, poll created')
              })
            }
          })
        })
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
      }
    })
  })

  const rewardTaskCompleteFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PL.projectLibraryAddress,
    topics: [web3.sha3('LogClaimTaskReward(address,uint256,address,uint256,uint256)')]
  })

  rewardTaskCompleteFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let index = parseInt(eventParamArr[1], 16)
    let taskClaimer = eventParamArr[2]
    taskClaimer = '0x' + taskClaimer.substr(-40)
    let weiReward = parseInt(eventParamArr[3], 16)
    let reputationReward = parseInt(eventParamArr[4], 16)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
      }
      User.findOne({account: taskClaimer}).exec((error, user) => {
        if (error) console.log('you are not the taskClaimer')
        if (user) {
          user.reputationBalance += reputationReward
          user.weiBalance += weiReward
          Project.findOne({address: projectAddress}).exec((error, doc) => {
            if (error) console.error(error)
            if (doc) {
              Task.findOne({project: doc.id, index: index}).exec((error, task) => {
                if (error) console.error(error)
                task.workerRewarded = true
                task.save(err => {
                  if (err) console.error(error)
                })
              })
            }
            user.save(err => {
              if (err) console.error(error)
              console.log('task completer successfully rewarded')
            })
          })
        }
      })
    })
  })

  const ProjectExpiredFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PL.projectLibraryAddress,
    topics: [web3.sha3('LogProjectExpired(address)')]
  })

  ProjectExpiredFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
      }
      Project.findOne({address: projectAddress}).exec((error, doc) => {
        if (error) console.error(error)
        if (doc) {
          doc.state = 8
          doc.save(err => {
            if (err) console.error(err)
            console.log('project expired')
          })
        }
      })
    })
  })
}
