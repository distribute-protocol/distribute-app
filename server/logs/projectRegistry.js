const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PR = require('../../frontend/src/abi/ProjectRegistry')
const mongoose = require('mongoose')
const User = require('../models/user')
const Project = require('../models/project')

module.exports = function () {
  // filter for register events
  const projectCreatedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectCreated(address)')]
  })

  // Because you were defining the variables in the context of the below closure they aren't defined in the new Project that you were calling.
  // We define them before and then they are available everywhere. DELETE THIS MESSAGE WHEN YOU READ IT
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
      let nextDeadline = parseInt(eventParamArr[3], 16)
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
      Project.findOne({address: projectAddress}).exec((error, doc) => {
        if (error) console.error(error)
        if (!doc) {
          doc = new Project({
            _id: new mongoose.Types.ObjectId(),
            activeStatePeriod,
            address: projectAddress,
            ipfsHash,
            nextDeadline,
            passThreshold,
            proposer,
            proposerType,
            reputationBalance: 0,
            reputationCost,
            stakedStatePeriod,
            state,
            turnoverTime,
            validateStatePeriod,
            voteCommitPeriod,
            voteRevealPeriod,
            weiBal: 0,
            weiCost
          })
          User.findOne({account: proposer}).exec((error, user) => {
            if (error) console.error(error)
            doc.save((error, saved) => {
              if (error) throw Error
              console.log('project details updated')
              if (user.projects) {
                user.projects.push(saved.id)
              }
              user.save(error => {
                if (error) console.error(error)
                console.log('user updated')
              })
              projectDetailsFilter.stopWatching()
            })
          })
        }
      })
    })
  })
}
