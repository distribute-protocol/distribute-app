const web3 = require('../connections/web3')
const { ProjectLibraryABI, ProjectLibraryAddress } = require('../abi/ProjectLibrary')
const Project = require('../models/project')
const Task = require('../models/task')
const Network = require('../models/network')
const User = require('../models/user')
const ProcessedTxs = require('../models/processedTxs')
const netStatus = require('./network')

module.exports = function () {
  const ProjectLibraryContract = new web3.eth.Contract(ProjectLibraryABI, ProjectLibraryAddress)

  ProjectLibraryContract.events.LogTaskValidated({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { taskAddress, projectAddress, confirmation } = event.returnValues
        const project = await Project.findOneAndUpdate({address: projectAddress, state: 4}, {state: 5}, {new: true})
        if (!project) console.error('project not successfully updated')
        let confirmationBool = !!parseInt(confirmation)
        const task = await Task.findOneAndUpdate({address: taskAddress}, {confirmation: confirmationBool, workerRewardClaimable: confirmationBool, validationRewardClaimable: true}, {new: true})
        if (!task) console.error('task not successfully updated')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  ProjectLibraryContract.events.LogTaskVote({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { taskAddress, projectAddress, pollNonce } = event.returnValues
        const project = await Project.findOneAndUpdate({address: projectAddress, state: 4}, {state: 5}, {new: true})
        if (!project) console.error('project not successfully updated')
        const task = await Task.findOneAndUpdate({address: taskAddress}, {state: 5, pollNonce}, {new: true})
        if (!task) console.error('task not successfully updated')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  ProjectLibraryContract.events.LogClaimTaskReward({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress, index, claimer, weiReward, reputationReward } = event.returnValues
        const user = await User.findOneAndUpdate({wallets: claimer}, {$inc: {reputationBalance: reputationReward, weiBalance: weiReward}}, {new: true})
        if (!user) console.error('user not successfully updated')
        const project = await Project.findOne({address: projectAddress})
        if (!project) console.error('project not successfully updated')
        const task = await Task.findOneAndUpdate({project: project.id, index}, {workerRewarded: true}, {new: true})
        if (!task) console.error('task not successfully updated')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  ProjectLibraryContract.events.LogProjectExpired({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { projectAddress } = event.returnValues
        const project = await Project.findOneAndUpdate({address: projectAddress}, {state: 8}, {new: true})
        if (!project) console.error('project not successfully updated')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  ProjectLibraryContract.events.LogTokenRefund({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { staker, refund } = event.returnValues
        const user = await User.findOneAndUpdate({wallets: staker}, {$inc: {tokenBalance: refund}}, {new: true})
        if (!user) console.error('user not successfully updated')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })

  ProjectLibraryContract.events.LogReputationRefund({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        let { staker, refund } = event.returnValues
        const user = await User.findOneAndUpdate({wallets: staker}, {$inc: {reputationBalance: refund}}, {new: true})
        if (!user) console.error('user not successfully updated')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      }
    } catch (err) {
      console.log(err)
    }
  })
}
