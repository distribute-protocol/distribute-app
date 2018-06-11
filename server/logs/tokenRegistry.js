const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const TR = require('../../frontend/src/abi/TokenRegistry')

const Network = require('../models/network')
const User = require('../models/user')
const Project = require('../models/project')

module.exports = function () {
  // filter for project created
  const proposeProjectFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3]('ProjectCreated(address)')
  })

  proposeProjectFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let eventParams = result.topics[1] // WHAT IS THIS DOOING
    let account = '0x' + eventParams.substr(-40)

    User.findOne({account: account}).exec((err, userStatus) => {
      console.log(account)
      if (err) throw Error
      userStatus.tokenBalance -= 0.05 * weiCost
      userStatus.save(err => {
        if (err) throw Error
        console.log('project proposed by token holder')
      })
    })


  })
}
