const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PR = require('../../frontend/src/abi/ProjectRegistry')
<<<<<<< HEAD
=======
const mongoose = require('mongoose')
>>>>>>> d77890288a1d0ee1f83db0b620bbb7df82493a5f

const Network = require('../models/network')
const User = require('../models/user')
const Project = require('../models/project')

module.exports = function () {
  // filter for register events
  const projectCreatedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
<<<<<<< HEAD
    topics: [web3.sha3('LogProjectCreated(address,address,uint256,uint256)')]
  })

  projectCreatedFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = result.topics[1]
    let account = eventParamArr[2]
    let projectCost = parseInt(eventParamArr[3])
    let proposerStake = parseInt(eventParamArr[4])
    let sender = eventParamArr[5]
  })

  let project = new Project({
    state: 1,
    weiCost: projectCost,
    proposer: account,
    address: projectAddress,
    proposerStake: collateral,
    proposerType: (proposerType ? 'token' : 'reputation')
  })
  project.save(err => {
    if (err) throw Error
    console.log('project details updated')
  })

=======
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
    let weiCost, reputationCost, state, nextDeadline, proposer, proposerType, ipfsHash,
      stakedStatePeriod, activeStatePeriod, turnoverTime, validateStatePeriod, voteCommitPeriod,
      voteRevealPeriod, passThreshold
    projectDetailsFilter.watch(async (error, result) => {
      if (error) console.error(error)
      let eventParamArr = result.data.slice(2).match(/.{1,64}/g)
      weiCost = parseInt(eventParamArr[0], 16)
      reputationCost = parseInt(eventParamArr[1], 16)
      state = parseInt(eventParamArr[2], 16)
      nextDeadline = parseInt(eventParamArr[3], 16)
      proposer = '0x' + eventParamArr[4].slice(eventParamArr[4].length - 40, eventParamArr[4].length)
      proposerType = parseInt(eventParamArr[5], 16)
      ipfsHash = web3.toAscii('0x' + eventParamArr[15] + eventParamArr[16].slice(0, 28))
      stakedStatePeriod = parseInt(eventParamArr[7], 16)
      activeStatePeriod = parseInt(eventParamArr[8], 16)
      turnoverTime = parseInt(eventParamArr[9], 16)
      validateStatePeriod = parseInt(eventParamArr[10], 16)
      voteCommitPeriod = parseInt(eventParamArr[11], 16)
      voteRevealPeriod = parseInt(eventParamArr[12], 16)
      passThreshold = parseInt(eventParamArr[13], 16)
      // console.log(weiCost, reputationCost, state, nextDeadline, proposer, proposerType, ipfsHash, stakedStatePeriod, activeStatePeriod, turnoverTime, validateStatePeriod, voteCommitPeriod, voteRevealPeriod, passThreshold)
      // // if the keys and the values use the same variable you don't have to separate them out. DELETE THIS MESSAGE WHEN YOU READ IT.
      let project = new Project({
        _id: new mongoose.Types.ObjectId(),
        address: projectAddress,
        weiCost,
        weiBal: 0,
        reputationCost,
        reputationBal: 0,
        state,
        nextDeadline,
        proposer,
        proposerType,
        ipfsHash,
        stakedStatePeriod,
        activeStatePeriod,
        turnoverTime,
        validateStatePeriod,
        voteCommitPeriod,
        voteRevealPeriod,
        passThreshold
      })
      project.save(err => {
        if (err) throw Error
        console.log('project details updated')
        projectDetailsFilter.stopWatching()
      })
    })
  })
>>>>>>> d77890288a1d0ee1f83db0b620bbb7df82493a5f
}
