const web3 = require('../connections/web3')
const _ = require('lodash')
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

  ReputationRegistryContract.events.LogRegister({from: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let account = event.returnValues.account
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOneAndUpdate({account}, {$inc: { reputationBalance: 10000 }}, {upsert: true, setDefaultsOnInsert: true, new: true})
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

  ReputationRegistryContract.events.LogStakedReputation({from: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let projectAddress = event.returnValues.projectAddress
    let staker = event.returnValues.staker
    let reputationStaked = event.returnValues.reputation
    // let projectStaked = event.returnValues.projectStaked
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOneAndUpdate({account: staker}, {$inc: { reputationBalance: reputationStaked * (-1) }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOneAndUpdate({address: projectAddress}, {$inc: { reputationBalance: reputationStaked }})
        if (!project) {
          console.error('Project not created or updated')
        } else {
          await new Stake({amount: reputationStaked, projectId: project.id, type: 'reputation', user: user.id}).save()
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })

  ReputationRegistryContract.events.LogUnstakedReputation({from: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let projectAddress = event.returnValues.projectAddress
    let staker = event.returnValues.unstaker
    let reputationStaked = event.returnValues.reputation
    // let projectStaked = event.returnValues.projectStaked
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOneAndUpdate({account: staker}, {$inc: { reputationBalance: reputationStaked }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOneAndUpdate({address: projectAddress}, {$inc: { reputationBalance: reputationStaked * (-1) }})
        if (!project) {
          console.error('Project not created or updated')
        } else {
          await new Stake({amount: reputationStaked * (-1), projectId: project.id, type: 'reputation', user: user.id}).save()
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })

  ReputationRegistryContract.events.LogReputationVoteCommitted({from: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let projectAddress = event.returnValues.projectAddress
    let index = event.returnValues.index
    let votes = event.returnValues.votes
    let secretHash = event.returnValues.secretHash
    let pollId = event.returnValues.pollId
    let voter = event.returnValues.voter
    // let projectStaked = event.returnValues.projectStaked
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOneAndUpdate({account: voter}, {$inc: { reputationBalance: votes * (-1) }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOneAndUpdate({address: projectAddress}, {$inc: { reputationBalance: votes * (-1) }})
        if (!project) {
          console.error('Project not created or updated')
        } else {
          const task = Task.findOne({project: project.id, index})
          if (!task) {
            console.error('Task not found')
          } else {
            await new Vote({
              amount: votes,
              revealed: false,
              rescued: false,
              hash: secretHash,
              type: 'reputation',
              pollID: pollId,
              task: task.id,
              user: user.id
            }).save()
          }
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })

  ReputationRegistryContract.events.LogReputationVoteRevealed({from: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let projectAddress = event.returnValues.projectAddress
    let index = event.returnValues.index
    // let vote = event.returnValues.vote
    // let salt = event.returnValues.salt
    let voter = event.returnValues.voter
    // let projectStaked = event.returnValues.projectStaked
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOne({account: voter})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOne({address: projectAddress})
        if (!project) {
          console.error('Project not created or updated')
        } else {
          const task = Task.findOne({project: project.id, index})
          if (!task) {
            console.error('Task not found')
          } else {
            const vote = await Vote.findOne({task: task.id, user: user.id, type: 'reputation'})
            let changeIndex = _.findIndex(user.voteRecords, voteRecord => voteRecord.pollID === vote.pollID &&
              voteRecord.task == task.id &&
              voteRecord.voter == user.id &&
              voteRecord.type === 'reputation')
            let voteRecords = user.voteRecords
            let userVote = voteRecords[changeIndex]
            userVote.revealed = true
            voteRecords[changeIndex] = userVote
            user.voteRecords = voteRecords
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
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })

  ReputationRegistryContract.events.LogReputationVoteRescued({from: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let projectAddress = event.returnValues.projectAddress
    let index = event.returnValues.index
    let vote = event.returnValues.vote
    let salt = event.returnValues.salt
    let voter = event.returnValues.voter
    // let projectStaked = event.returnValues.projectStaked
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOne({account: voter})
        if (!user) { console.error('User not successfully created or updated') }
        const project = await Project.findOne({address: projectAddress})
        if (!project) {
          console.error('Project not created or updated')
        } else {
          const task = Task.findOne({project: project.id, index})
          if (!task) {
            console.error('Task not found')
          } else {
            const vote = await Vote.findOne({task: task.id, user: user.id, type: 'reputation'})
            let changeIndex = _.findIndex(user.voteRecords, voteRecord => voteRecord.pollID === vote.pollID &&
              voteRecord.task == task.id &&
              voteRecord.voter == user.id &&
              voteRecord.type === 'reputation')
            let voteRecords = user.voteRecords
            let userVote = voteRecords[changeIndex]
            userVote.rescued = true
            voteRecords[changeIndex] = userVote
            user.voteRecords = voteRecords
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
              console.log('token vote revealed')
            })
          }
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })
}
