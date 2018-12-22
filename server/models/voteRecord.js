const mongoose = require('mongoose')

let VoteRecordSchema = mongoose.Schema({
  task: mongoose.Schema.Types.ObjectId,
  pollID: Number,
  project: String,
  amount: Number,
  vote: String,
  salt: String,
  type: String,
  revealed: Boolean,
  rescued: Boolean,
  voter: mongoose.Schema.Types.ObjectId
})

const VoteRecord = mongoose.model('VoteRecord', VoteRecordSchema)

module.exports = { VoteRecord, VoteRecordSchema }
