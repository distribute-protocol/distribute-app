const web3 = require('../connections/web3')
const { ProjectRegistryABI, ProjectRegistryAddress } = require('../abi/ProjectRegistry')
const { ProjectABI } = require('../abi/Project')
const Project = require('../models/project')
const PrelimTaskList = require('../models/prelimTaskList')
const User = require('../models/user')
const Task = require('../models/task')
const Network = require('../models/network')
const ipfs = require('../utilities/ipfs-api')
const { TextDecoder } = require('text-encoding')
const { hashTasks } = require('../utilities/hashing')
const ProcessedTxs = require('../models/processedTxs')
const netStatus = require('./network')

module.exports = function () {
  const ProjectRegistryContract = new web3.eth.Contract(ProjectRegistryABI, ProjectRegistryAddress)

  ProjectRegistryContract.events.LogProjectCreated({ fromBlock: netStatus.lastBlock }).on('data', async event => {
    let transactionHash1 = event.transactionHash
    let logIndex1 = event.logIndex
    const processedTx1 = await ProcessedTxs.findOne({ transactionHash1, logIndex1 })
    if (!processedTx1) {
      let projectAddress = event.returnValues.projectAddress
      let proposerCost = event.returnValues.proposerCost
      const ProjectContract = await new web3.eth.Contract(ProjectABI, projectAddress)
      ProjectContract.events.LogProjectDetails({ fromBlock: 0 }).on('data', async event2 => {
        // if (err) { console.error('Error in project creation'); return }
        let transactionHash2 = event2.transactionHash
        let logIndex2 = event2.logIndex
        try {
          const processedTx2 = await ProcessedTxs.findOne({ transactionHash2, logIndex2 })
          if (!processedTx2) {
            let {
              weiCost,
              reputationCost,
              state,
              nextDeadline,
              proposer,
              proposerType,
              ipfsHash,
              turnoverTime,
              passThreshold
            } = event2.returnValues
            let stakedStatePeriod = event2.returnValues.stakedStatePeriod * 1000
            let activeStatePeriod = event2.returnValues.activeStatePeriod * 1000
            let validateStatePeriod = event2.returnValues.validateStatePeriod * 1000
            let voteCommitPeriod = event2.returnValues.voteCommitPeriod * 1000
            let voteRevealPeriod = event2.returnValues.voteRevealPeriod * 1000
            let parsedHash = web3.utils.hexToAscii(ipfsHash)
            ipfs.object.get(parsedHash, async (err, node) => {
              if (err) { console.error('ipfs failed to be retrieved'); throw err }
              let dataObj = JSON.parse(new TextDecoder('utf-8').decode(node.toJSON().data))
              let updateField = proposerType === 1 ? 'tokenBalance' : 'reputationBalance'
              const user = await User.findOneAndUpdate({ wallets: proposer.toLowerCase() }, { $inc: { [updateField]: proposerCost * (-1) } }, { new: true })
              if (!user) console.error('user not found')
              const project = await Project.findOneAndUpdate({ address: projectAddress }, { $set: {
                activeStatePeriod,
                parsedHash,
                listSubmitted: false,
                location: dataObj.location,
                name: dataObj.name,
                nextDeadline,
                originatorRewarded: false,
                passThreshold,
                photo: dataObj.photo,
                prelimTaskLists: [],
                proposer,
                proposerType,
                proposerRewarded: false,
                reputationBalance: 0,
                reputationCost,
                stakedStatePeriod,
                state,
                summary: dataObj.summary,
                taskList: [],
                turnoverTime,
                tokenBalance: 0,
                validateStatePeriod,
                voteCommitPeriod,
                voteRevealPeriod,
                weiBal: 0,
                weiCost
              } }, { upsert: true, new: true })
              if (!project) console.error('unable to update or create project')
              const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, { new: true })
              if (!network) { console.error('No networking database') }
              await new ProcessedTxs({ transactionHash1, logIndex1 }).save()
              await new ProcessedTxs({ transactionHash2, logIndex2 }).save()
            })
          }
        } catch (err) {
          console.err('Error in database connection')
        }
      })
    }
  })

  ProjectRegistryContract.events.LogProjectFullyStaked({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let projectAddress = event.returnValues.projectAddress
      let stakedStatus = event.returnValues.stakedStatus
      try {
        if (parseInt(stakedStatus) === 1) {
          const project = await Project.findOneAndUpdate({address: projectAddress, state: 1}, {state: 2}, {new: true})
          if (!project) console.error('project not updated to staked state')
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogTaskHashSubmitted({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { projectAddress, taskHash, submitter, weighting } = event.returnValues
      try {
        const prelimTaskList = await PrelimTaskList.findOneAndUpdate({submitter, address: projectAddress, hash: taskHash}, {$set: {
          verified: true,
          weighting: '' + weighting
        }}, {upsert: true, new: true})
        if (!prelimTaskList) console.error('Failed to update prelimTaskList')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogRefundProposer({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { projectAddress, contractCaller, proposer, proposedCost, proposedStake } = event.returnValues
      let reward = Math.floor(proposedCost / 20)
      try {
        const updateField = contractCaller === 1 ? 'tokenBalance' : 'reputationBalance'
        const user = User.findOneAndUpdate({account: proposer}, {$inc: {weiBalance: reward, [updateField]: proposedStake}}, {new: true})
        if (!user) console.error('User not updated correctly in log refund')
        const project = Project.findOneAndUpdate({address: projectAddress}, {$set: {proposerRewarded: true}}, {new: true})
        if (!project) console.error('Project not updated correctly in log refund')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogProjectActive({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { projectAddress, topTaskHash, activeFlag } = event.returnValues
      try {
        if (activeFlag === '0000000000000000000000000000000000000000000000000000000000000001') {
          const prelimTaskList = await PrelimTaskList.findOne({address: projectAddress, hash: topTaskHash})
          if (!prelimTaskList) console.error('prelimTaskList not found in logprojectactive')
          const project = await Project.findOneAndUpdate({address: projectAddress}, {$set: {state: 3, topTaskHash, taskList: prelimTaskList.content}}, {new: true})
          if (!project) console.error('project not updated in log project active')
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogFinalTaskCreated({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { taskAddress, projectAddress, finalTaskHash, index } = event.returnValues
      try {
        const project = Project.findOneAndUpdate({address: projectAddress}, {$set: {listSubmitted: true}}, {new: true})
        let taskListArr = JSON.parse(project.taskList)
        let taskContent = [taskListArr[index]]
        let taskHash = hashTasks(taskContent)
        if (finalTaskHash === taskHash[0]) {
          const task = await Task.findOneAndUpdate({address: taskAddress}, {$set: {
            address: taskAddress,
            pollNonce: null,
            project: project.id,
            claimed: false,
            complete: false,
            description: taskContent[0].description,
            index,
            state: true,
            validations: [],
            validationRewardClaimable: false,
            weighting: taskContent[0].percentage,
            workerRewardClaimable: false,
            workerRewarded: false
          }}, {upsert: true, new: true})
          if (!task) console.error('task not successfully created')
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogTaskClaimed({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { projectAddress, index, reputationVal, claimer } = event.returnValues
      try {
        const user = await User.findOneAndUpdate({account: claimer}, {$inc: {reputationBalance: reputationVal * (-1)}}, {new: true})
        if (!user) console.error('user not found')
        const project = await Project.findOne({address: projectAddress})
        if (!project) console.error('project not found')
        const task = await Task.findOneAndUpdate({project: project.id, index}, {claimed: true, claimer: user.id}, {new: true})
        if (!task) console.error('task not found')
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogSubmitTaskComplete({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { projectAddress, index, validationFee } = event.returnValues
      try {
        const project = await Project.findOne({address: projectAddress})
        if (!project) { console.error('Project not found') };
        const task = await Task.findOneAndUpdate({project: project.id, index}, {complete: true, validationFee}, {new: true})
        if (!task) { console.error('Task not updated') }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogProjectValidate({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { projectAddress, validate } = event.returnValues
      try {
        if (parseInt(validate) === 1) {
          const project = await Project.findOneAndUpdate({address: projectAddress, state: 3}, {$set: {state: 4}}, {new: true})
          if (!project) console.error('project not updated in log project validate')
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogProjectVoting({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { projectAddress, vote } = event.returnValues
      try {
        if (parseInt(vote) === 1) {
          const project = await Project.findOneAndUpdate({address: projectAddress, state: 4}, {$set: {state: 5}}, {new: true})
          if (!project) console.error('project not updated in log project validate')
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })

  ProjectRegistryContract.events.LogProjectEnd({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
    if (!processedTx) {
      let { projectAddress, end } = event.returnValues
      try {
        if (parseInt(end) === 1 || parseInt(end) === 2) {
          const project = await Project.findOneAndUpdate({address: projectAddress, state: 5}, {$set: {state: end < 2 ? 6 : 7}}, {new: true})
          if (!project) console.error('project not updated in log project validate')
          const tasks = await Task.updateMany({project: project.id}, {$set: {state: false}}, {new: true})
          if (!tasks) console.error('project tasks not updated')
        }
        await new ProcessedTxs({transactionHash, logIndex}).save()
        const network = await Network.findOneAndUpdate({}, { lastBlock: event.blockNumber }, {new: true})
        if (!network) { console.error('No networking database') }
      } catch (err) {
        console.log(err)
      }
    }
  })
}
