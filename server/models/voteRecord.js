const mongoose = require('mongoose')

let VoteRecordSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  task: mongoose.Schema.Types.ObjectId,
  pollID: Number,
  amount: Number,
  vote: String,
  salt: String,
  type: String,
  voter: mongoose.Schema.Types.ObjectId
})

const VoteRecord = mongoose.model('VoteRecord', VoteRecordSchema)

module.exports = { VoteRecord, VoteRecordSchema }
