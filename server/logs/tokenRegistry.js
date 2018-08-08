const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const mongoose = require('mongoose')
const TR = require('../../frontend/src/abi/TokenRegistry')
const Network = require('../models/network')
const Stake = require('../models/stake')
const Project = require('../models/project')
const User = require('../models/user')
const Task = require('../models/task')
const Validation = require('../models/validation')

module.exports = function () {
  // filter staked tokens
  const stakedTokensFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogStakedTokens(address,uint256,uint256,address)')]
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
      console.log(txHash)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save(err => {
          if (err) console.log(err)
        })
      }
      User.findOne({account: account}).exec((err, userStatus) => {
        if (err) console.error(error)
        if (userStatus !== null) {
          userStatus.tokenBalance -= tokensStaked
          userStatus.save(err => {
            if (err) console.error(error)
          })
        }
        Project.findOne({address: projectAddress}).exec((error, doc) => {
          if (error) console.error(error)
          let StakeEvent = new Stake({
            _id: new mongoose.Types.ObjectId(),
            amount: tokensStaked,
            project: doc.id,
            type: 'token',
            userId: userStatus.id
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
        })
      })
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
              userId: userStatus.id
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
            // console.log(taskStatus, ValidationEvent, ValidationEvent.id)
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
    // console.log(projectAddress, index, weiReward, tokenReturnAmount, validator)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
      }
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
                    console.log('here 2', validation)
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
    })
  })
}
