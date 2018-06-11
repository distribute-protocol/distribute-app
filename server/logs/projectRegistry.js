const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PR = require('../../frontend/src/abi/ProjectRegistry')

const Network = require('../models/network')
const User = require('../models/user')
const Project = require('../models/project')

module.exports = function () {
  // filter for register events
  const projectCreatedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
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

}
