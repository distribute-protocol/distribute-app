const mongoose = require('mongoose')

let projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: String,
  weiCost: Number,
  weiBal: Number,
  reputationCost: Number,
  reputationBal: Number,
  state: Number,
  nextDeadline: Date,
  proposer: String,
  proposerType: Number,
  ipfsHash: String,
  stakedStatePeriod: Number,
  activeStatePeriod: Number,
  turnoverTime: Number,
  validateStatePeriod: Number,
  voteCommitPeriod: Number,
  voteRevealPeriod: Number,
  passThreshold: Number,
  stakers: [{ address: mongoose.Schema.Types.ObjectId, amount: Number, type: String, taskList: [{}] }],
  taskIds: [mongoose.Schema.Types.ObjectId]
})

module.exports = projectSchema
