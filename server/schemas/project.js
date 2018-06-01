const mongoose = require('mongoose')

let projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  state: Number,
  weiBal: Number,
  weiCost: Number,
  reputationBal: Number,
  reputationCost: Number,
  proposer: String,
  proposerType: String,
  nextDeadline: Date,
  stakers: [{address: mongoose.Schema.Types.ObjectId, amount: Number, type: String, taskList: [{ }] }],
  taskIds: [mongoose.Schema.Types.ObjectId]
})

module.exports = projectSchema
