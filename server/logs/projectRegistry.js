const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PR = require('../../frontend/src/abi/ProjectRegistry')
const mongoose = require('mongoose')
const Project = require('../models/project')
const PrelimTaskList = require('../models/prelimTaskList')
const Task = require('../models/task')
const ipfs = require('../ipfs-api')
const { TextDecoder } = require('text-encoding')

module.exports = function () {
  // filter for project created events
  const projectCreatedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectCreated(address)')]
  })

  let projectAddress
  projectCreatedFilter.watch(async (error, result) => {
    if (error) console.error(error)
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
      let eventParamArr = result.data.slice(2).match(/.{1,64}/g)
      let weiCost = parseInt(eventParamArr[0], 16)
      let reputationCost = parseInt(eventParamArr[1], 16)
      let state = parseInt(eventParamArr[2], 16)
      let nextDeadline = Date.now() + parseInt(eventParamArr[3], 16)
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
        Project.findOne({address: projectAddress}).exec((error, doc) => {
          if (error) console.error(error)
          if (!doc) {
            doc = new Project({
              _id: new mongoose.Types.ObjectId(),
              activeStatePeriod,
              address: projectAddress,
              ipfsHash,
              location: dataObj.location,
              name: dataObj.name,
              nextDeadline,
              passThreshold,
              photo: dataObj.photo,
              prelimTaskLists: [],
              proposer,
              proposerType,
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
            doc.save((error, saved) => {
              if (error) console.error(error)
              console.log('project details updated')
              projectDetailsFilter.stopWatching()
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
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let flag = eventParamArr[1]
    if (flag === '0000000000000000000000000000000000000000000000000000000000000001') {
      Project.findOne({address: projectAddress}).exec((error, doc) => {
        if (error) console.error(error)
        if (doc) {
          doc.state = 2
          doc.save(err => {
            if (err) console.error(error)
            console.log('project fully staked')
          })
        }
      })
    }
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
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let taskHash = '0x' + eventParamArr[1]
    let submitter = eventParamArr[2]
    submitter = '0x' + submitter.substr(-40)
    let weighting = parseInt(eventParamArr[3], 16)
    Project.findOne({address: projectAddress}).exec((error, doc) => {
      if (error) console.error(error)
      PrelimTaskList.findOne({submitter: submitter}).exec((error, prelimTaskList) => {
        if (error) console.error(error)
        if (prelimTaskList !== null && prelimTaskList.hash === taskHash) {
          prelimTaskList.verified = true
          prelimTaskList.weighting = weighting
          prelimTaskList.save(error => {
            if (error) console.error(error)
            console.log('prelim task list submitted')
          })
        }
      })
    })
  })
  const projectActiveFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectActive(address,bytes32,bool)')]
  })
  projectActiveFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let topTaskHash = '0x' + eventParamArr[1]
    let flag = eventParamArr[2]
    let finalTasks
    if (flag === '0000000000000000000000000000000000000000000000000000000000000001') {
      PrelimTaskList.findOne({address: projectAddress, hash: topTaskHash}).exec((error, prelimTaskList) => {
        if (error) console.error(error)
        if (prelimTaskList !== null) {
          finalTasks = prelimTaskList.content
        }
      })
      Project.findOne({address: projectAddress}).exec((error, project) => {
        if (error) console.error(error)
        if (project) {
          project.state = 3
          project.topTaskHash = topTaskHash
          project.taskList = finalTasks
          project.save(err => {
            if (err) console.error(error)
            console.log('active project with topTaskHash')
          })
        }
      })
    }
  })
  const finalTasksFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogFinalTaskCreated(address,address,bytes32,uint256)')]
  })
  finalTasksFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let taskAddress = eventParamArr[0]
    taskAddress = '0x' + taskAddress.substr(-40)
    let projectAddress = eventParamArr[1]
    projectAddress = '0x' + projectAddress.substr(-40)
    let topTaskHash = '0x' + eventParamArr[2]
    let index = parseInt(eventParamArr[3], 16)
    console.log(topTaskHash, typeof topTaskHash, 'hash here')
    Project.findOne({address: projectAddress}).exec((error, doc) => {
      if (error) console.error(error)
      console.log(doc.taskList, 'here is the task info')
      console.log(index, 'i here')
      // get weighting and description
      if (doc.topTaskHash === topTaskHash) {
        let finalTask = new Task({
          _id: new mongoose.Types.ObjectId(),
          address: taskAddress,
          projectId: doc.id,
          claimed: false,
          complete: false,
          index,
          validationRewardClaimable: false,
          workerRewardClaimable: false
        })
        finalTask.save(err => {
          if (err) console.error(error)
          console.log('final tasks created')
        })
      } else {
        console.log('task hashes do not match')
      }
    })
  })
}
