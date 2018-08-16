const mongoose = require('mongoose')

let userVoteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  task: mongoose.Schema.Types.ObjectId,
  // projectAddress: String,
  // taskIndex: Number,
  vote: String,
  salt: String,
  voter: mongoose.Schema.Types.ObjectId
})

const userVote = mongoose.model('UserVote', userVoteSchema)

module.exports = userVote
