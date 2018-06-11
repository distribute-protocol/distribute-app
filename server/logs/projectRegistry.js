const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const RR = require('../../frontend/src/abi/ProjectRegistry')

const Network = require('../models/network')
const User = require('../models/user')

module.exports = function () {
  // filter for register events
  const ProjectCreated = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PR.projectRegistryAddress,
    topics: [web3.sha3('LogProjectCreated(address,address,uint256,uint256)')]
  })
  

}
