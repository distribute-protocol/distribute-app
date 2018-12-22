const mongoose = require('mongoose')

let voteSchema = mongoose.Schema({
  task: mongoose.Schema.Types.ObjectId,
  pollID: Number,
  project: mongoose.Schema.Types.ObjectId,
  amount: Number,
  hash: String,
  vote: String,
  salt: String,
  type: String,
  revealed: Boolean,
  rescued: Boolean,
  voter: mongoose.Schema.Types.ObjectId
})

const Vote = mongoose.model('Vote', voteSchema)

module.exports = Vote
