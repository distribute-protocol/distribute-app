const mongoose = require('mongoose')

let networkSchema = mongoose.Schema({
  totalTokens: Number,
  totalReputation: Number,
  weiBal: Number,
  processedTxs: mongoose.Schema.Types.Mixed
})

const Network = mongoose.model('Network', networkSchema)

module.exports = Network
