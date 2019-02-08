const web3 = require('../connections/web3')
const { TokenRegistryABI, TokenRegistryAddress } = require('../abi/TokenRegistry')
const Network = require('../models/network')
const Stake = require('../models/stake')
const Project = require('../models/project')
const User = require('../models/user')
const Task = require('../models/task')
const Validation = require('../models/validation')
const Vote = require('../models/vote')
const ProcessedTxs = require('../models/processedTxs')
const netStatus = require('./network')

module.exports = function () {
  const TokenRegistryContract = new web3.eth.Contract(TokenRegistryABI, TokenRegistryAddress)

  TokenRegistryContract.events.LogStakedTokens({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, tokens, weiChange, staker } = event.returnValues
        const user = await User.findOneAndUpdate(
          {account: staker},
          {$inc: { tokenBalance: tokens * (-1) }},
          {upsert: true, setDefaultsOnInsert: true, new: true}
        )
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOneAndUpdate({address: projectAddress}, {$inc: { tokenBalance: tokens, weiBal: weiChange }}, {new: true})
        if (!project) { console.error('Project not created or updated') }
        await new Stake({amount: tokens, project: project.id, type: 'token', user: user.id}).save()
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  TokenRegistryContract.events.LogUnstakedTokens({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, tokens, weiChange, unstaker } = event.returnValues
        const user = await User.findOneAndUpdate(
          {account: unstaker},
          {$inc: { tokenBalance: tokens }},
          {upsert: true, setDefaultsOnInsert: true, new: true}
        )
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOneAndUpdate({address: projectAddress}, {$inc: { tokenBalance: tokens * (-1), weiBal: weiChange * (-1) }}, {new: true})
        if (!project) { console.error('Project not created or updated') }
        await new Stake({amount: tokens * (-1), project: project.id, type: 'token', user: user.id}).save()
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  TokenRegistryContract.events.LogValidateTask({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, validationFee, validationState, taskIndex, validator } = event.returnValues

        const user = await User.findOneAndUpdate(
          {account: validator},
          {$inc: {tokenBalance: validationFee * (-1)}},
          {upsert: true, setDefaultsOnInsert: true, new: true}
        )
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOne({address: projectAddress})
        if (!project) { console.error('Project not created or updated') }
        const task = await Task.findOne({project: project.id, index: taskIndex})
        if (!task) { console.error('Task not created or updated') }
        await new Validation({amount: validationFee, task: task.id, user: validator, state: validationState, project: project.id, rewarded: false})
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  TokenRegistryContract.events.LogRewardValidator({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, index, weiReward, returnAmount, validator } = event.returnValues

        const user = await User.findOneAndUpdate(
          {account: validator},
          {$inc: {tokenBalance: returnAmount, weiBalance: weiReward}},
          {upsert: true, setDefaultsOnInsert: true, new: true}
        )
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOne({address: projectAddress})
        if (!project) { console.error('Project not created or updated') }
        const task = await Task.findOne({project: project.id, index})
        if (!task) { console.error('Task not created or updated') }
        const validation = await Validation.findOneAndUpdate({task: task.id, user: validator}, {rewarded: true}, {new: true})
        if (!validation) { console.error('Validation not created or updated') }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  TokenRegistryContract.events.LogTokenVoteCommitted({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, index, votes, secretHash, pollId, voter } = event.returnValues
        const user = await User.findOneAndUpdate({wallets: voter}, {$inc: { tokenBalance: votes * (-1) }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOne({address: projectAddress})
        if (!project) { console.error('Project not found') }
        const task = Task.findOne({project: project.id, index})
        if (!task) { console.error('Task not found') }
        const vote = await Vote.findOneAndUpdate({
          amount: votes,
          pollID: pollId,
          project: project.id,
          revealed: false,
          rescued: false,
          task: task.id,
          type: 'tokens',
          voter: user.id
        }, { $set: {
          hash: secretHash
        }}, {upsert: true})
        if (!vote) console.error('vote not added successfully')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  TokenRegistryContract.events.LogTokenVoteRevealed({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, index, vote, salt, voter } = event.returnValues
        const user = await User.findOne({account: voter})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOne({address: projectAddress})
        if (!project) { console.error('Project not found') }
        const task = Task.findOne({project: project.id, index})
        if (!task) { console.error('Task not found') }
        const voteRecord = await Vote.findOneAndUpdate({
          vote: vote,
          salt: salt,
          task: task.id,
          type: 'tokens',
          voter: user.id
        }, {$set: {revealed: true}})
        if (!voteRecord) console.error('vote not added successfully')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  TokenRegistryContract.events.LogTokenVoteRescued({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, pollIndex, pollId, voter } = event.returnValues
        const user = await User.findOne({account: voter})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOne({address: projectAddress})
        if (!project) { console.error('Project not found') }
        const task = Task.findOne({project: project.id, index: pollId})
        if (!task) { console.error('Task not found') }
        const vote = await Vote.findOneAndUpdate({
          index: pollIndex,
          task: task.id,
          type: 'tokens',
          voter: user.id,
          pollId: pollId
        }, {$set: {rescued: true}})
        if (!vote) console.error('vote not updated successfully')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  TokenRegistryContract.events.LogRewardOriginator({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress } = event.returnValues
        const project = await Project.findOneAndUpdate({address: projectAddress}, {originatorRewarded: true}, {new: true})
        if (!project) { console.error('Project not found') }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })
}
