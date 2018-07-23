const mongoose = require('mongoose')

let prelimTaskListSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: String,
  submitter: String,
  hash: String,
  weighting: Number,
  content: String,
  verified: Boolean
})

const PrelimTaskList = mongoose.model('PrelimTaskList', prelimTaskListSchema)

module.exports = PrelimTaskList
