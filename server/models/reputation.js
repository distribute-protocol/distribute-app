const mongoose = require('mongoose')

let reputationSchema = mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number
})

const Reputation = mongoose.model('Reputation', reputationSchema)

module.exports = Reputation
