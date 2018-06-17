const mongoose = require('mongoose')

let voteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  amount: Number,
  state: Boolean,
  type: String,
  taskId: mongoose.Schema.Types.ObjectId,
  userid: mongoose.Schema.Types.ObjectId
})

const Vote = mongoose.model('Vote', voteSchema)

module.exports = Vote
