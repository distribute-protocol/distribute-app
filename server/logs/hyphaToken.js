const web3 = require('../connections/web3')
const { HyphaTokenABI, HyphaTokenAddress } = require('../abi/HyphaToken')
const Network = require('../models/network')
const User = require('../models/user')
const Token = require('../models/token')
const ProcessedTxs = require('../models/processedTxs')
const netStatus = require('./network')

module.exports = function () {
  const HyphaTokenContract = new web3.eth.Contract(HyphaTokenABI, HyphaTokenAddress)

  HyphaTokenContract.events.LogMint({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let minter = event.returnValues.minter
    let amountMinted = event.returnValues.amountMinted
    let totalCost = event.returnValues.totalCost
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOneAndUpdate({wallets: minter}, {$inc: { tokenBalance: amountMinted }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully updated') }
        await new Token({ userId: user.id, amount: amountMinted, ether: totalCost }).save()
        const network = await Network.findOneAndUpdate({},
          {
            lastBlock: event.blockNumber,
            $inc: {
              totalTokens: amountMinted,
              weiBal: totalCost
            }
          },
          {new: true}
        )
        if (!network) { console.error('No networking database') }
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })

  HyphaTokenContract.events.LogSell({fromBlock: netStatus.lastBlock}).on('data', async event => {
    let transactionHash = event.transactionHash
    let logIndex = event.logIndex
    let seller = event.returnValues.seller
    let amountSold = event.returnValues.amountSold * (-1)
    let totalCost = event.returnValues.totalCost
    try {
      const processedTx = await ProcessedTxs.findOne({transactionHash, logIndex})
      if (!processedTx) {
        const user = await User.findOneAndUpdate({wallets: seller}, {$inc: { tokenBalance: amountSold }}, {upsert: true, setDefaultsOnInsert: true, new: true})
        if (!user) { console.error('User not successfully updated') }
        await new Token({ userId: user.id, amount: amountSold, ether: totalCost }).save()
        const network = await Network.findOneAndUpdate({},
          {
            lastBlock: event.blockNumber,
            $inc: {
              totalTokens: amountSold,
              weiBal: totalCost
            }
          },
          {new: true}
        )
        if (!network) { console.error('No networking database') }
        await new ProcessedTxs({transactionHash, logIndex}).save()
      }
    } catch (err) {
      console.log(err)
    }
  })
}
