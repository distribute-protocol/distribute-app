const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const mongoose = require('mongoose')
const TR = require('../../frontend/src/abi/TokenRegistry')
const Stake = require('../models/stake')
const Project = require('../models/project')
const User = require('../models/user')

module.exports = function () {
  // filter for project created
  const stakedTokensFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: TR.TokenRegistryAddress,
    topics: [web3.sha3('LogStakedTokens(address,uint256,address)')]
  })
  stakedTokensFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let projectAddress = result.topics[1]
    projectAddress = '0x' + projectAddress.slice(projectAddress.length - 40, projectAddress.length)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let tokensStaked = parseInt(eventParamArr[0], 16)
    let account = eventParamArr[1]
    account = '0x' + account.substr(-40)
    User.findOne({account: account}).exec((err, userStatus) => {
      if (err) console.error(error)
      userStatus.tokenBalance -= tokensStaked
      userStatus.save(err => {
        if (err) console.error(error)
      })
      Project.findOne({address: projectAddress}).exec((error, doc) => {
        if (error) console.error(error)
        let StakeEvent = new Stake({
          _id: new mongoose.Types.ObjectId(),
          amount: tokensStaked,
          projectId: doc.id,
          type: 'token',
          userId: userStatus.id
        })
        doc.tokenBalance += tokensStaked
        doc.save((error, saved) => {
          if (error) console.error(error)
          console.log('tokens staked')
        })
        StakeEvent.save((error, saved) => {
          if (error) console.error(error)
          console.log('tokens staked')
        })
      })
    })
  })
}
