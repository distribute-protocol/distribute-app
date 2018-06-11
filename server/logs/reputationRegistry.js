const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const RR = require('../../frontend/src/abi/ReputationRegistry')

const Network = require('../models/network')
const User = require('../models/user')

module.exports = function () {
  // filter for register events
  const registerFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: RR.ReputationRegistryAddress,
    topics: [web3.sha3('LogRegister(address)')]
  })

  registerFilter.watch(async (error, result) => {
    if (error) console.error(error)
    let eventParams = result.topics[1]
    let account = '0x' + eventParams.substr(-40)

    User.findOne({account: account}).exec((err, userStatus) => {
      console.log(account)
      if (err) throw Error
      userStatus.reputationBalance += 10000
      userStatus.save(err => {
        if (err) throw Error
        console.log('user registerd')
      })
    })

    Network.findOne({}).exec((err, netStatus) => {
      if (err) throw Error
      netStatus.totalReputation += 10000
      netStatus.save(err => {
        if (err) throw Error
        console.log('network updated w/user registered')
      })
    })
  })

  // const proposeProjectFilter = web3.eth.filter({
  //   fromBlock: 0,
  //   toBlock: 'latest',
  //   address: RR.ReputationRegistryAddress,
  //   topics: [web3.sha3('ProjectCreated(address,uint256,uint256,address)')]
  // })
  //
  // proposeProjectFilter.watch(async (error, result) => {
  //   if (error) console.error(error)
  //   let eventParams = result.data
  //   let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
  //   let projectAddress = result.topics[1]
  //   let account = '0x' + eventParams.substr(-40)
  //   console.log(eventParamArr)
  //   let projectCost = parseInt(eventParamArr[2], 16)
  //   let collateral = parseInt(eventParamArr[3], 16)
  //
  //   User.findOne({account: account}).exec((err, userStatus) => {
  //     console.log(account)
  //     if (err) throw Error
  //     userStatus.reputationBalance -= 0.05 * proj
  //     userStatus.save(err => {
  //       if (err) throw Error
  //       console.log('project proposed by reputation holder')
  //     })
  //   })
  //   let project = new Project(
  //     { // figure out how to get rid of padding
  //       state: 1,
  //       weiCost: projectCost,
  //       proposer: account,
  //       address: projectAddress,
  //       proposerStake: collateral,
  //       proposerType: 'reputation'
  //     }
  //   )
  //   project.save(err => {
  //     if (err) throw Error
  //     console.log('project details updated')
  //   })
  // })
}
