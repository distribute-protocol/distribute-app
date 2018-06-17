const mongoose = require('mongoose')

let networkSchema = mongoose.Schema({
  totalTokens: Number,
  totalReputation: Number,
  weiBal: Number
})

const Network = mongoose.model('Network', networkSchema)

module.exports = Network
