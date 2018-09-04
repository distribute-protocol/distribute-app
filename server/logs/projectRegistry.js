const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PR = require('../../frontend/src/abi/ProjectRegistry')
const mongoose = require('mongoose')
const Project = require('../models/project')
const PrelimTaskList = require('../models/prelimTaskList')
const User = require('../models/user')
const Task = require('../models/task')
const Network = require('../models/network')
const ipfs = require('../utilities/ipfs-api')
const { TextDecoder } = require('text-encoding')
const { hashTasks } = require('../utilities/hashing')

module.exports = function () {
  // filter for project created events
  const projectCreatedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectCreated(address,uint256)')]
  })
  let projectAddress
  let txHash
  projectCreatedFilter.watch(async (error, result) => {
    if (error) console.error(error)
    txHash = result.transactionHash
    let eventParamArr = result.data.slice(2).match(/.{1,64}/g)
    let proposerCost = parseInt(eventParamArr[0], 16)
    projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    const projectDetailsFilter = web3.eth.filter({
      fromBlock: 0,
      toBlock: 'latest',
      address: projectAddress,
      topics: [web3.sha3('LogProjectDetails(uint256,uint256,uint256,uint256,address,uint256,bytes,uint256,uint256,uint256,uint256,uint256,uint256,uint256)')]
    })
    projectDetailsFilter.watch(async (error, result) => {
      if (error) console.error(error)
      txHash = result.transactionHash
      eventParamArr = result.data.slice(2).match(/.{1,64}/g)
      let weiCost = parseInt(eventParamArr[0], 16)
      let reputationCost = parseInt(eventParamArr[1], 16)
      let state = parseInt(eventParamArr[2], 16)
      let nextDeadline = parseInt(eventParamArr[3], 16) * 1000
      let proposer = '0x' + eventParamArr[4].slice(eventParamArr[4].length - 40, eventParamArr[4].length)
      let proposerType = parseInt(eventParamArr[5], 16)
      let ipfsHash = web3.toAscii('0x' + eventParamArr[15] + eventParamArr[16].slice(0, 28))
      let stakedStatePeriod = parseInt(eventParamArr[7], 16) * 1000
      let activeStatePeriod = parseInt(eventParamArr[8], 16) * 1000
      let turnoverTime = parseInt(eventParamArr[9], 16)
      let validateStatePeriod = parseInt(eventParamArr[10], 16) * 1000
      let voteCommitPeriod = parseInt(eventParamArr[11], 16) * 1000
      let voteRevealPeriod = parseInt(eventParamArr[12], 16) * 1000
      let passThreshold = parseInt(eventParamArr[13], 16)
      ipfs.object.get(ipfsHash, (err, node) => {
        if (err) {
          throw err
        }
        let dataObj = JSON.parse(new TextDecoder('utf-8').decode(node.toJSON().data))
        Network.findOne({}).exec((err, netStatus) => {
          if (err) console.error(err)
          if (typeof netStatus.processedTxs[txHash] === 'undefined') {
            netStatus.processedTxs[txHash] = true
            netStatus.markModified('processedTxs')
            netStatus.save((err, returned) => {
              if (err) throw Error
            })
            User.findOne({account: proposer}).exec((error, user) => {
              if (error) console.error(err)
              if (user !== null) {
                proposerType === 1
                  ? user.tokenBalance -= proposerCost
                  : user.reputationBalance -= proposerCost
                user.save((err, returned) => {
                  if (err) throw Error
                })
              }
            })
            Project.findOne({address: projectAddress}).exec((error, doc) => {
              if (error) console.error(error)
              if (!doc) {
                doc = new Project({
                  _id: new mongoose.Types.ObjectId(),
                  activeStatePeriod,
                  address: projectAddress,
                  ipfsHash,
                  listSubmitted: false,
                  location: dataObj.location,
                  name: dataObj.name,
                  nextDeadline,
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
                })
                doc.save(error => {
                  if (error) console.error(error)
                  console.log('project details updated')
                  projectDetailsFilter.stopWatching()
                })
              }
            })
          }
        })
      })
    })
  })
  // filter for fully staked projects
  const projectFullyStakedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectFullyStaked(address,bool)')]
  })
  projectFullyStakedFilter.watch(async (err, result) => {
    if (err) console.error(err)
    // let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let flag = eventParamArr[1]
    // Network.findOne({}).exec((err, netStatus) => {
    //   if (err) console.error(err)
    //   if (typeof netStatus.processedTxs[txHash] === 'undefined') {
    //     netStatus.processedTxs[txHash] = true
    //     netStatus.markModified('processedTxs')
        if (parseInt(flag) === 1) {
          Project.findOne({address: projectAddress}).exec((error, doc) => {
            if (error) console.error(error)
            if (doc !== null) {
              if (doc.state === 1) {
                doc.state = 2
              }
              doc.save(err => {
                if (err) console.error(error)
                console.log('project fully staked')
              })
            }
          })
        }
    //     netStatus.save((err, returned) => {
    //       if (err) throw Error
    //     })
    //   }
    // })
  })
  // filter for task hash submissions
  const taskHashSubmittedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogTaskHashSubmitted(address,bytes32,address,uint256)')]
  })
  taskHashSubmittedFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = '0x' + eventParamArr[0].substr(-40)
    let taskHash = '0x' + eventParamArr[1]
    let submitter = '0x' + eventParamArr[2].substr(-40)
    let weighting = parseInt(eventParamArr[3], 16) / (10 ** 15)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
        Project.findOne({address: projectAddress}).exec((error, doc) => {
          if (error) console.error(error)
          PrelimTaskList.findOne({submitter: submitter}).exec((error, prelimTaskList) => {
            if (error) console.error(error)
            if (prelimTaskList !== null && prelimTaskList.hash === taskHash) {
              // console.log(prelimTaskList)
              prelimTaskList.verified = true
              prelimTaskList.weighting = '' + weighting
              prelimTaskList.save(error => {
                if (error) console.error(error)
                console.log('prelim task list submitted')
              })
            }
          })
        })
      }
    })
  })

  const rewardOriginatorFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogRewardOriginator(address,address,uint256)')]
  })
  rewardOriginatorFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = '0x' + eventParamArr[0].substr(-40)
    let proposer = '0x' + eventParamArr[1].substr(-40)
    let reward = parseInt(eventParamArr[2], 16)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        User.findOne({account: proposer}).exec((err, user) => {
          if (err) console.error(err)
          if (user !== null) {
            user.weiBalance += reward
            user.save(err => {
              if (err) console.error(err)
              console.log('added proposer reward to user wei balance')
            })
          }
        })
        Project.findOne({address: projectAddress}).exec((err, project) => {
          if (err) console.error(err)
          if (project !== null) {
            project.proposerRewarded = true
            project.save(err => {
              if (err) console.error(err)
              console.log('proposerRewarded set to true')
            })
          }
        })
      }
    })
  })

  // filter for active projects
  const projectActiveFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectActive(address,bytes32,bool)')]
  })
  projectActiveFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let topTaskHash = '0x' + eventParamArr[1]
    let flag = eventParamArr[2]
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        if (flag === '0000000000000000000000000000000000000000000000000000000000000001') {
          PrelimTaskList.findOne({address: projectAddress, hash: topTaskHash}).exec((error, prelimTaskList) => {
            if (error) console.error(error)
            if (prelimTaskList !== null) {
              Project.findOne({address: projectAddress}).exec((error, project) => {
                if (error) console.error(error)
                if (project) {
                  project.state = 3
                  project.topTaskHash = topTaskHash
                  project.taskList = prelimTaskList.content
                  // console.log('final tasks:', project.taskList)
                  project.save(err => {
                    if (err) console.error(error)
                    console.log('active project with topTaskHash')
                  })
                }
              })
            }
          })
        }
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
      }
    })
  })
  //  filter for final tasks submitted
  const finalTasksFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogFinalTaskCreated(address,address,bytes32,uint256)')]
  })
  finalTasksFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let taskAddress = eventParamArr[0]
    taskAddress = '0x' + taskAddress.substr(-40)
    let projectAddress = eventParamArr[1]
    projectAddress = '0x' + projectAddress.substr(-40)
    let individualTaskHash = '0x' + eventParamArr[2]
    let index = parseInt(eventParamArr[3], 16)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
        Task.findOne({address: taskAddress}).exec((error, task) => {
          if (error) console.error(error)
          if (!task) {
            Project.findOne({address: projectAddress}).exec((error, doc) => {
              if (error) console.error(error)
              if (doc) {
                let taskListArr = JSON.parse(doc.taskList)
                let taskContent = [taskListArr[index]]
                let taskHash = hashTasks(taskContent)
                doc.listSubmitted = true
                if (individualTaskHash === taskHash[0]) {
                  let finalTask = new Task({
                    _id: new mongoose.Types.ObjectId(),
                    address: taskAddress,
                    pollNonce: null,
                    project: doc.id,
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
                  })
                  finalTask.save(err => {
                    if (err) console.error(error)
                    console.log('final tasks created')
                  })
                  doc.save(err => {
                    if (err) console.error(error)
                    console.log('list submitted')
                  })
                } else {
                  console.log('task hashes do not match')
                }
              }
            })
          }
        })
      }
    })
  })
  // filter for claiming task
  const taskClaimedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogTaskClaimed(address,uint256,uint256,address)')]
  })
  taskClaimedFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let index = parseInt(eventParamArr[1], 16)
    let reputationVal = parseInt(eventParamArr[2], 16)
    let claimer = eventParamArr[3]
    claimer = '0x' + claimer.substr(-40)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
        User.findOne({account: claimer}).exec((error, user) => {
          if (error) console.error(error)
          if (user) {
            user.reputationBalance -= reputationVal
          }
          if (user) {
            Project.findOne({address: projectAddress}).exec((error, doc) => {
              if (error) console.error(error)
              if (doc) {
                Task.findOne({project: doc.id, index: index}).exec((error, task) => {
                  if (error) console.error(error)
                  task.claimed = true
                  task.claimer = user.id
                  // task.claimedAt
                  user.tasks.push(task.id)
                  task.save(err => {
                    if (err) console.error(err)
                  })
                })
                doc.save(err => {
                  if (err) console.error(error)
                  console.log('doc saved')
                })
              }
              user.save(err => {
                if (err) console.error(error)
                console.log('claimer saved')
              })
            })
          }
        })
      }
    })
  })
  // filter for task submitted complete
  const submitTaskCompleteFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogSubmitTaskComplete(address,uint256,uint256)')]
  })
  submitTaskCompleteFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let index = parseInt(eventParamArr[1], 16)
    let validationFee = parseInt(eventParamArr[2], 16)
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err, returned) => {
          if (err) throw Error
        })
        Project.findOne({address: projectAddress}).exec((error, doc) => {
          if (error) console.error(error)
          if (doc) {
            Task.findOne({project: doc.id, index: index}).exec((error, task) => {
              if (error) console.error(error)
              task.complete = true
              task.validationFee = validationFee
              task.save(err => {
                if (err) console.error(err)
                console.log('task submitted complete')
              })
            })
          }
        })
      }
    })
  })
  // filter for project tasks ready to be validated
  const projectValidateFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectValidate(address,bool)')]
  })
  projectValidateFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let flag = eventParamArr[1]
    Network.findOne({}).exec((err, netStatus) => {
      if (err) console.error(err)
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
      }
      if (parseInt(flag) === 1) {
        Project.findOne({address: projectAddress}).exec((error, project) => {
          if (error) console.error(error)
          if (project) {
            project.state = 4
            project.save(err => {
              if (err) console.error(error)
              console.log('validate project')
            })
          }
        })
      }
      netStatus.save((err, returned) => {
        if (err) throw Error
      })
    })
  })
  // filter for project tasks ready to be voted on
  const projectVoteFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectVoting(address,bool)')]
  })
  projectVoteFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let flag = parseInt(eventParamArr[1])
    // Network.findOne({}).exec((err, netStatus) => {
    //   if (err) console.error(err)
    //   if (typeof netStatus.processedTxs[txHash] === 'undefined') {
    //     netStatus.processedTxs[txHash] = true
    //     netStatus.markModified('processedTxs')
        if (flag === 1) {
          Project.findOne({address: projectAddress}).exec((error, project) => {
            if (error) console.error(error)
            if (project.state === 4) {
              project.state = 5
              project.save(err => {
                if (err) console.error(error)
                console.log('move to stage voting')
              })
            }
          })
        }
    //     netStatus.save((err, returned) => {
    //       if (err) throw Error
    //     })
    //   }
    // })
  })
  // filter for project ended
  const projectEndFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectEnd(address,uint256)')]
  })

  projectEndFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    // let flag = eventParamArr[1]
    let flag = parseInt(eventParamArr[1])
    // console.log(projectAddress, flag)
    // Network.findOne({}).exec((err, netStatus) => {
    //   if (err) console.error(err)
    //   if (typeof netStatus.processedTxs[txHash] === 'undefined') {
    //     netStatus.processedTxs[txHash] = true
    //     netStatus.markModified('processedTxs')
      if (parseInt(flag) === 1 || parseInt(flag) === 2) {
        Project.findOne({address: projectAddress}).exec((error, project) => {
          if (error) console.error(error)
          if (project) {
            flag < 2 ? project.state = 6 : project.state = 7
            Task.find({project: project.id}).exec((error, tasks) => {
              if (error) console.error(error)
              tasks.map((task, i) => {
                task.state = false
                task.save(err => {
                  if (err) console.error(error)
                  console.log('task moved to final state')
                })
              })
            })
            project.save(err => {
              if (err) console.error(error)
              console.log(`move to stage ${flag < 2 ? 'completed' : 'failed'}`)
            })
          }
        })
      }
        //   netStatus.save((err, returned) => {
        //     if (err) throw Error
        //   })
        // }
    // })
  })
}
