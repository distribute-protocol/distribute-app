const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const mongoose = require('mongoose')
const TR = require('../abi/TokenRegistry')
const Network = require('../models/network')
const Stake = require('../models/stake')
const Project = require('../models/project')
const User = require('../models/user')
const Task = require('../models/task')
const Validation = require('../models/validation')
const Vote = require('../models/vote')
const _ = require('lodash')

module.exports = function () {
  // filter staked tokens
  const stakedTokensFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogStakedTokens(address,uint256,uint256,address,bool)')]
  })
  stakedTokensFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let txHash = result.transactionHash
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let tokensStaked = parseInt(eventParamArr[0], 16)
    let weiChange = parseInt(eventParamArr[1], 16)
    let account = eventParamArr[2]
    account = '0x' + account.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        User.findOne({account}).exec((err, userStatus) => {
          if (err) console.error(error)
          if (userStatus !== null) {
            userStatus.tokenBalance -= tokensStaked
            userStatus.save(err => {
              if (err) console.error(error)
            })
          }
          Project.findOne({address: projectAddress}).exec((error, doc) => {
            if (error) console.error(error)
            if (doc) {
              let StakeEvent = new Stake({
                _id: new mongoose.Types.ObjectId(),
                amount: tokensStaked,
                project: doc.id,
                type: 'token',
                user: userStatus.id
              })
              doc.tokenBalance += tokensStaked
              doc.weiBal += weiChange
              doc.save((error, saved) => {
                if (error) console.error(error)
              })
              StakeEvent.save((error, saved) => {
                if (error) console.error(error)
                console.log('tokens staked')
              })
            }
          })
        })
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
    })
  })
  // filter unstaked tokens
  const unstakedTokensFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogUnstakedTokens(address,uint256,uint256,address)')]
  })
  unstakedTokensFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let txHash = result.transactionHash
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let tokensUnstaked = parseInt(eventParamArr[0], 16)
    let weiChange = parseInt(eventParamArr[1], 16)
    let account = eventParamArr[2]
    account = '0x' + account.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        User.findOne({account: account}).exec((err, userStatus) => {
          if (err) console.error(error)
          userStatus.tokenBalance += tokensUnstaked
          userStatus.save(err => {
            if (err) console.error(error)
          })
          Project.findOne({address: projectAddress}).exec((error, doc) => {
            if (error) console.error(error)
            let StakeEvent = new Stake({
              _id: new mongoose.Types.ObjectId(),
              amount: -1 * tokensUnstaked,
              projectId: doc.id,
              type: 'token',
              user: userStatus.id
            })
            doc.tokenBalance -= tokensUnstaked
            doc.weiBal -= weiChange
            doc.save((error, saved) => {
              if (error) console.error(error)
            })
            StakeEvent.save((error, saved) => {
              if (error) console.error(error)
              console.log('tokens unstaked')
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
  // filter validated tasks
  const validatedTasksFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogValidateTask(address,uint256,bool,uint256,address)')]
  })
  validatedTasksFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let txHash = result.transactionHash
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let validationFee = parseInt(eventParamArr[0], 16)
    let validationState = parseInt(eventParamArr[1], 16)
    let taskIndex = parseInt(eventParamArr[2], 16)
    let validator = eventParamArr[3]
    validator = '0x' + validator.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        // subtract tokens from user balance
        User.findOne({account: validator}).exec((err, userStatus) => {
          if (userStatus) {
            if (err) console.error(err)
            userStatus.tokenBalance -= validationFee
            userStatus.save(err => {
              if (err) console.error(err)
            })
          }
        })
        // create validation entry
        Project.findOne({address: projectAddress}).exec((error, doc) => {
          if (error) console.error(error)
          Task.findOne({project: doc.id, index: taskIndex}).exec((error, taskStatus) => {
            if (error) console.error(error)
            let ValidationEvent = new Validation({
              _id: new mongoose.Types.ObjectId(),
              amount: validationFee,
              task: taskStatus.id,
              user: validator,
              state: validationState,
              address: taskStatus.address,
              projAddress: projectAddress,
              rewarded: false
            })
            ValidationEvent.save(err => {
              if (err) console.error(err)
              console.log('new validation event saved', validationState)
            })
            // add validation to user
            User.findOne({account: validator}).exec((error, userStatus) => {
              if (error) console.error(error)
              userStatus.validations.push(ValidationEvent.id)
              userStatus.save(err => {
                if (err) console.error(err)
              })
            })
            taskStatus.validations.push(ValidationEvent.id)
            taskStatus.markModified('validations')
            taskStatus.save(err => {
              if (err) console.error(err)
            })
          })
        })
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save(err => {
          if (err) console.error(err)
        })
      }
    })
  })
  // filter for validator retrieving award
  const rewardValidatorFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogRewardValidator(address,uint256,uint256,uint256,address)')]
  })
  rewardValidatorFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.substr(-40)
    let index = parseInt(eventParamArr[0], 16)
    let weiReward = parseInt(eventParamArr[1], 16)
    let tokenReturnAmount = parseInt(eventParamArr[2], 16)
    let validator = eventParamArr[3]
    validator = '0x' + validator.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        User.findOne({account: validator}).exec((error, user) => {
          if (error) console.log(error)
          if (user) {
            user.tokenBalance += tokenReturnAmount
            user.weiBalance += weiReward
          }
          if (user) {
            Project.findOne({address: projectAddress}).exec((error, doc) => {
              if (error) console.error(error)
              if (doc) {
                Task.findOne({project: doc.id, index: index}).exec((error, task) => {
                  if (error) console.error(error)
                  // task.validationRewardClaimable = false
                  Validation.findOne({task: task.id, user: validator}).exec((error, validation) => {
                    if (error) console.error(error)
                    if (validation) {
                      validation.rewarded = true
                      validation.save(err => {
                        if (err) console.error(err)
                      })
                    }
                  })
                  task.save(err => {
                    if (err) console.error(err)
                  })
                })
                doc.save(err => {
                  if (err) console.error(error)
                })
                user.save(err => {
                  if (err) console.error(error)
                  console.log('validator successfully rewarded')
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

  const tokenVoteCommitedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogTokenVoteCommitted(address,uint256,uint256,bytes32,uint256,address)')]
  })

  tokenVoteCommitedFilter.watch(async (error, result) => {
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
          user.tokenBalance -= stakeAmount
          if (user !== null) {
            Project.findOne({address: projectAddress}).exec((err, project) => {
              if (err) console.error(error, 'Project not found')
              Task.findOne({project: project.id, index: taskIndex}).exec((err, task) => {
                if (err) console.error(error, 'Task not found')
                if (task !== null) {
                  let vote = new Vote({
                    _id: new mongoose.Types.ObjectId(),
                    amount: stakeAmount,
                    revealed: false,
                    rescued: false,
                    hash: secretHash,
                    type: 'tokens',
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
          user.save((err, returned) => {
            if (err) throw Error
          })
        })
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
    })
  })

  const tokenVoteRevealedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogTokenVoteRevealed(address,uint256,uint256,uint256,address)')]
  })

  tokenVoteRevealedFilter.watch(async (error, result) => {
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
                    Vote.findOne({task: task.id, user: user.id, type: 'tokens'}).exec((err, vote) => {
                      if (err) console.error(error)
                      if (vote !== null) {
                        let changeIndex = _.findIndex(user.voteRecords, (vR) => vR.pollID === vote.pollID && vR.task == task.id && vR.voter == user.id && vR.type === 'tokens')
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

  const tokenVoteRescuedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogTokenVoteRescued(address,uint256,uint256,address)')]
  })

  tokenVoteRescuedFilter.watch(async (error, result) => {
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
        User.findOne({account: account}).exec((err, user) => {
          if (err) console.error(error)
          if (user !== null) {
            Project.findOne({address: projectAddress}).exec((err, project) => {
              if (err) console.error(error)
              if (project !== null) {
                Task.findOne({project: project.id, index: taskIndex}).exec((err, task) => {
                  if (err) console.error(error)
                  if (task !== null) {
                    Vote.findOne({task: task.id, user: user.id, type: 'tokens'}).exec((err, vote) => {
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
          }
        })
        netStatus.markModified('processedTxs')
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
    })
  })
}
