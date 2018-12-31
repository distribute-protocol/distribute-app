const Network = require('../models/network')
const assert = require('assert')

let networkInit = async function () {
  try {
    let network, findNetwork
    findNetwork = await Network.findOne({})
    if (!findNetwork) {
      network = await Network.findOneAndUpdate({},
        { $set:
          { totalTokens: 0,
            totalReputation: 0,
            weiBal: 0,
            lastBlock: 0
          }
        }, { upsert: true, new: true })
      if (!network) console.error('network not initiated')
      return network
    }
  } catch (err) {
    console.error(err)
  }
}
let network = networkInit()

module.exports = network
