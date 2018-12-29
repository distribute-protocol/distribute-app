const mongoose = require('mongoose')

let StakeSchema = mongoose.Schema({
  amount: Number,
  project: mongoose.Schema.Types.ObjectId,
  type: String,
  user: mongoose.Schema.Types.ObjectId
})

const Stake = mongoose.model('Stake', StakeSchema)

module.exports = Stake
