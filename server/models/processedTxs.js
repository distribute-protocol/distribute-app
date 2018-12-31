const mongoose = require('mongoose')

let processedTxsSchema = mongoose.Schema({
  transactionHash: String,
  logIndex: Number
})

processedTxsSchema.index({transactionHash: 1, logIndex: 1}, {unique: true})

const ProcessedTxs = mongoose.model('ProcessedTxs', processedTxsSchema)

module.exports = ProcessedTxs
