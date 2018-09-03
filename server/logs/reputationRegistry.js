const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const mongoose = require('mongoose')

const RR = require('../../frontend/src/abi/ReputationRegistry')

const Network = require('../models/network')
const Stake = require('../models/stake')
const Project = require('../models/project')
const User = require('../models/user')
const Vote = require('../models/vote')
const VoteRecord = require('../models/voteRecord')
const Task = require('../models/task')

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
    let txHash = result.transactionHash
    let eventParams = result.topics[1]
    let account = '0x' + eventParams.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (netStatus) {
        if (typeof netStatus.processedTxs[txHash] === 'undefined') {
          netStatus.totalReputation += 10000
          netStatus.processedTxs[txHash] = true
          netStatus.markModified('processedTxs')
          netStatus.save((err, doc) => {
            if (err) throw Error
            console.log('network updated w/user registered')
          })
          User.findOne({account}).exec((err, userStatus) => {
            if (err) throw Error
            if (userStatus && userStatus.reputationBalance === 0) {
              userStatus.reputationBalance += 10000
              userStatus.save(err => {
                if (err) throw Error
                console.log('user registered')
              })
            }
          })
        }
      }
    })
  })
  // filter for staked reputation
  const stakedReputationFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogStakedReputation(address,uint256,address,bool)')]
  })
  stakedReputationFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let txHash = result.transactionHash
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let reputationStaked = parseInt(eventParamArr[0], 16)
    let account = eventParamArr[1]
    account = '0x' + account.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        User.findOne({account: account}).exec((err, userStatus) => {
          if (err) console.error(error)
          if (userStatus !== null) {
            userStatus.reputationBalance -= reputationStaked
            userStatus.save(err => {
              if (err) console.error(error)
            })
          }
          Project.findOne({address: projectAddress}).exec((error, projectStatus) => {
            if (error) console.error(error)
            if (projectStatus !== null) {
              let StakeEvent = new Stake({
                _id: new mongoose.Types.ObjectId(),
                amount: reputationStaked,
                projectId: projectStatus.id,
                type: 'reputation',
                user: userStatus.id
              })
              projectStatus.reputationBalance += reputationStaked
              projectStatus.save((error, saved) => {
                if (error) console.error(error)
              })
              StakeEvent.save((error, saved) => {
                if (error) console.error(error)
                console.log('reputation staked')
              })
            }
          })
        })
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
    })
  })
  // filter for unstaked reputation
  const unstakedReputationFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogUnstakedReputation(address,uint256,address)')]
  })
  unstakedReputationFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let txHash = result.transactionHash
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let reputationStaked = parseInt(eventParamArr[0], 16)
    let account = eventParamArr[1]
    account = '0x' + account.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
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
              user: userStatus.id
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
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
    })
  })

  const reputationVoteCommitedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogReputationVoteCommitted(address,uint256,uint256,bytes32,uint256,address)')]
  })

  reputationVoteCommitedFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let txHash = result.transactionHash
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParamArr = result.data.slice(2).match(/.{1,64}/g)
    let taskIndex = parseInt(eventParamArr[0], 16)
    let stakeAmount = parseInt(eventParamArr[1], 16)
    let secretHash = eventParamArr[2]
    let pollID = parseInt(eventParamArr[3], 16)
    let account = eventParamArr[4]
    account = '0x' + account.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        User.findOne({account}).exec((err, user) => {
          if (err) console.error(error)
          if (user !== null) {
            Project.findOne({address: projectAddress}).exec((err, project) => {
              if (err) console.error(error, 'Project not found')
              Task.findOne({project: project.id, index: taskIndex}).exec((err, task) => {
                if (err) console.error(error, 'Task not found')
                if (task) {
                  let vote = new Vote({
                    _id: new mongoose.Types.ObjectId(),
                    amount: stakeAmount,
                    revealed: false,
                    rescued: false,
                    hash: secretHash,
                    type: 'reputation',
                    pollID,
                    task: task.id,
                    user: user.id
                  })
                  vote.save((err, saved) => {
                    if (err) console.error(err)
                    console.log('token vote saved')
                  })
                }
              })
            })
          }
        })
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
    })
  })

  const reputationVoteRevealedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogReputationVoteRevealed(address,uint256,uint256,uint256,address)')]
  })

  reputationVoteRevealedFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let txHash = result.transactionHash
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParamArr = result.data.slice(2).match(/.{1,64}/g)
    let taskIndex = parseInt(eventParamArr[0], 16)
    // let voteOption = parseInt(eventParamArr[1], 16)
    // let salt = parseInt(eventParamArr[2], 16)
    let account = eventParamArr[3]
    account = '0x' + account.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        User.findOne({account}).exec((err, user) => {
          if (err) console.error(error)
          if (user !== null) {
            Project.findOne({address: projectAddress}).exec((err, project) => {
              if (err) console.error(error)
              if (project !== null) {
                Task.findOne({project: project.id, index: taskIndex}).exec((err, task) => {
                  if (err) console.error(error)
                  if (task !== null) {
                    Vote.findOne({task: task.id, user: user.id, type: 'reputation'}).exec((err, vote) => {
                      if (err) console.error(error)
                      if (vote !== null) {
                        let changeIndex = _.findIndex(
                          user.voteRecords,
                          (vR) => vR.pollID === vote.pollID &&
                          vR.task === task.id &&
                          vR.voter === user.id &&
                          vR.type === 'reputation'
                        )
                        let voteRecords = user.voteRecords
                        let userVote = voteRecords[changeIndex]
                        userVote.revealed = true
                        voteRecords[changeIndex] = userVote
                        user.voteRecords = voteRecords
                        // user.markModified('voteRecords')
                        user.save((err, saved) => {
                          if (err) {
                            console.error(err)
                          } else {
                            console.log('user vote record updated')
                          }
                        })
                        vote.revealed = true
                        vote.save((err, saved) => {
                          if (err) console.error(err)
                          console.log('token vote revealed')
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
    })
  })

  const reputationVoteRescuedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogReputationVoteRescued(address,uint256,uint256,address)')]
  })

  reputationVoteRescuedFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let txHash = result.transactionHash
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParamArr = result.data.slice(2).match(/.{1,64}/g)
    let taskIndex = parseInt(eventParamArr[0], 16)
    // let pollId = parseInt(eventParamArr[1], 16)
    let account = eventParamArr[2]
    account = '0x' + account.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        User.findOne({account}).exec((err, user) => {
          if (err) console.error(error)
          if (user !== null) {
            Task.findOne({project: projectAddress, index: taskIndex}).exec((err, task) => {
              if (err) console.error(error)
              if (task !== null) {
                Vote.findOne({task: task.id, user: user.id, type: 'reputation'}).exec((err, vote) => {
                  if (err) console.error(error)
                  if (vote !== null) {
                    let changeIndex = _.findIndex(user.voteRecords, (vR) => vR.pollID === vote.pollID && vR.task == task.id && vR.voter == user.id && vR.type === 'tokens')
                    let voteRecords = user.voteRecords
                    let userVote = voteRecords[changeIndex]
                    userVote.rescued = true
                    voteRecords[changeIndex] = userVote
                    user.voteRecords = voteRecords
                    // user.markModified('voteRecords')
                    user.save((err, saved) => {
                      if (err) {
                        console.error(err)
                      } else {
                        console.log('user vote record updated')
                      }
                    })
                    vote.rescued = true
                    vote.save((err, saved) => {
                      if (err) console.error(err)
                      console.log('rep vote rescued')
                    })
                  }
                })
              }
            })
          }
        })
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
    })
  })
}
