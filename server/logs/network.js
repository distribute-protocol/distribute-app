const Network = require('../models/network')
const assert = require('assert')

let network

Network.findOne({}).exec((err, doc) => {
  if (err) console.error(err)
  if (!doc) {
    let network = new Network({
      totalTokens: 0,
      totalReputation: 0,
      weiBal: 0,
      processedTxs: {_: true}
    })
    network.save((err, doc) => {
      assert.equal(err, null)
      network = doc
    })
  }
})

module.exports = network
