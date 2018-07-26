const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PL = require('../../frontend/src/abi/ProjectLibrary')
const mongoose = require('mongoose')
const Project = require('../models/project')
const Task = require('../models/task')
const Network = require('../models/network')

module.exports = function () {
  const taskPassedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PL.projectLibraryAddress,
    topics: [web3.sha3('LogTaskPass(address,bool)')]
  })
  projectFullyStakedFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let projectAddress = eventParamArr[0]
    projectAddress = '0x' + projectAddress.substr(-40)
    let confirmation = parseInt(eventParamArr[1], 16)

}
