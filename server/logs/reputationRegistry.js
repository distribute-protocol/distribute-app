const web3 = require('../connections/web3')
const { ReputationRegistryABI, ReputationRegistryAddress } = require('../abi/ReputationRegistry')
const Network = require('../models/network')
const Stake = require('../models/stake')
const Project = require('../models/project')
const User = require('../models/user')
const Vote = require('../models/vote')
const Task = require('../models/task')
const ProcessedTxs = require('../models/processedTxs')
const netStatus = require('./network')

module.exports = function () {
  const ReputationRegistryContract = new web3.eth.Contract(ReputationRegistryABI, ReputationRegistryAddress)

  ReputationRegistryContract.events.LogRegister({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let account = event.returnValues.account
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOneAndUpdate({wallets: account.toLowerCase()}, {$inc: { reputationBalance: 10000 }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully updated') }
        const network = await Network.findOneAndUpdate({},
          {
            lastBlock: event.blockNumber,
            $inc: {
              totalReputation: 10000
            }
          },
          {new: true}
        )
        if (!network) { console.error('No networking database') }
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })

  ReputationRegistryContract.events.LogStakedReputation({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, staker, reputation } = event.returnValues
        const user = await User.findOneAndUpdate(
          {wallets: staker.toLowerCase()},
          {$inc: { reputationBalance: reputation * (-1) }},
          {upsert: true, setDefaultsOnInsert: true, new: true}
        )
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOneAndUpdate({address: projectAddress}, {$inc: { reputationBalance: reputation }}, {new: true})
        if (!project) { console.error('Project not created or updated') }
        await new Stake({amount: reputation, project: project.id, type: 'reputation', user: user.id}).save()
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  ReputationRegistryContract.events.LogUnstakedReputation({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let projectAddress = event.returnValues.projectAddress
    let staker = event.returnValues.unstaker
    let reputationStaked = event.returnValues.reputation
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOneAndUpdate({wallets: staker.toLowerCase()}, {$inc: { reputationBalance: reputationStaked }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOneAndUpdate({address: projectAddress}, {$inc: { reputationBalance: reputationStaked * (-1) }}, {new: true})
        if (!project) { console.error('Project not created or updated') }
        await new Stake({amount: reputationStaked * (-1), project: project.id, type: 'reputation', user: user.id}).save()
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  ReputationRegistryContract.events.LogReputationVoteCommitted({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, index, votes, secretHash, pollId, voter } = event.returnValues
        const user = await User.findOneAndUpdate({wallets: voter}, {$inc: { reputationBalance: votes * (-1) }}, {upsert: true, setDefaultsOnInsert: true, new: true})
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
          type: 'reputation',
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

  ReputationRegistryContract.events.LogReputationVoteRevealed({fromBlock: netStatus.lastBlock}).on('data', async event => {
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
          type: 'reputation',
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

  ReputationRegistryContract.events.LogReputationVoteRescued({fromBlock: netStatus.lastBlock}).on('data', async event => {
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
          type: 'reputation',
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
}
