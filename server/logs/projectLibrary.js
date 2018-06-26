const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const PL = require('../../frontend/src/abi/ProjectLibrary')
const mongoose = require('mongoose')
const Project = require('../models/project')
const ipfs = require('../ipfs-api')
const { TextDecoder } = require('text-encoding')

module.exports = function () {
  // filter for register events
  const projectFullyStakedFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: PL.ProjectLibraryAddress,
    topics: [web3.sha3('LogProjectFullyStaked(address)')]
  })
  let projectAddress
  projectFullyStakedFilter.watch(async (err, result) => {
    if (err) console.error(err)
    projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
  })
  Project.findOne({address: projectAddress}).exec((error, doc) => {
    if (error) console.error(error)
    doc.state = 2
    doc.save(err => {
      if (err) console.error(error)
    })
  })
}
