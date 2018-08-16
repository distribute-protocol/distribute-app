const mongoose = require('mongoose')

let voteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  amount: Number,
  revealed: Boolean,
  rescued: Boolean,
  hash: String,
  type: String,
  pollID: Number,
  prevPollID: Number,
  taskId: mongoose.Schema.Types.ObjectId,
  userid: mongoose.Schema.Types.ObjectId
})

const Vote = mongoose.model('Vote', voteSchema)

module.exports = Vote
