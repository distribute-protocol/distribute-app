const web3 = require('../connections/web3')
const HYP = require('../abi/HyphaToken')
// const assert = require('assert')
// const mongoose = require('mongoose')
const Network = require('../models/network')
const User = require('../models/user')
const Token = require('../models/token')
const ProcessedTxs = require('../models/processedTxs')

module.exports = function () {
  const HyphaTokenContract = new web3.eth.Contract(HYP.HyphaTokenABI, HYP.HyphaTokenAddress)
  // console.log('HyphaToken', HyphaTokenContract)
  // initialize network model --> ONLY DO THIS ONCE

  // update block and fetch latest block before instantiating new logs
  HyphaTokenContract.events.LogMint({fromBlock: 0}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let minter = event.returnValues.minter
    let amountMinted = event.returnValues.amountMinted
    let totalCost = event.returnValues.totalCost
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const network = await Network.findOneAndUpdate({},
          {
            lastBlock: event.lastBlock,
            $inc: {
              totalTokens: amountMinted,
              weiBal: totalCost
            }
          },
          {new: true}
        )
        if (!network) { console.error('No networking database') }
        const user = await User.findOneAndUpdate({wallets: minter}, {$inc: { tokenBalance: amountMinted }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully updated') }
        await new Token({ userId: user.id, amount: amountMinted, ether: totalCost }).save()
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })

/*
  mintFilter.watch(async (err, result) => {
    if (err) console.error(err)
  })

  // filter for selling events
  const sellFilter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: DT.DistributeTokenAddress,
    topics: [web3.utils.sha3('LogWithdraw(uint256,uint256,address)')]
  })

  sellFilter.watch(async (err, result) => {
    if (err) console.error(err)
    let txHash = result.transactionHash
    let eventParamArr = result.data.slice(2).match(/.{1,64}/g)
    let account = '0x' + eventParamArr[2].substr(-40)
    let tokensBurned = eventParamArr[0]
    let weiWithdrawn = eventParamArr[1]
    // convert result from hex to decimal
    tokensBurned = -1 * parseInt(tokensBurned, 16)
    Network.findOne({}).exec((err, netStatus) => {
      if (typeof netStatus.processedTxs[txHash] === 'undefined') {
        if (err) console.error('heyyy', err)
        netStatus.totalTokens += tokensBurned
        netStatus.weiBal -= weiWithdrawn
        netStatus.processedTxs[txHash] = true
        netStatus.markModified('processedTxs')
        netStatus.save((err) => {
          if (err) console.error(err)
          console.log('sell event: netStatus updated')
        })
        User.findOne({account: account}).exec((err, userStatus) => {
          if (err) console.error(err)
          let TokenEvent = new Token({
            _id: new mongoose.Types.ObjectId(),
            userId: userStatus.id,
            amount: tokensBurned,
            ether: weiWithdrawn
          })
          TokenEvent.save((err) => {
            if (err) console.error(err)
          })
        })
      }
    })
  })
  */
}
