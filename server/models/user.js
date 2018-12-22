const mongoose = require('mongoose')
const { VoteRecordSchema } = require('./voteRecord')

let userSchema = mongoose.Schema({
  account: String,
  wallets: [String],
  name: String,
  reputationBalance: Number,
  tokenBalance: Number,
  tasks: [mongoose.Schema.Types.ObjectId],
  validations: [mongoose.Schema.Types.ObjectId],
  voteRecords: [VoteRecordSchema],
  weiBalance: Number
})

const User = mongoose.model('User', userSchema)

module.exports = User
