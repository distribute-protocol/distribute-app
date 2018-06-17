const mongoose = require('mongoose')

let projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  activeStatePeriod: Number,
  address: String,
  ipfsHash: String,
  nextDeadline: Date,
  passThreshold: Number,
  proposer: String,
  proposerType: Number,
  reputationBalance: Number,
  reputationCost: Number,
  stakedStatePeriod: Number,
  stakes: [mongoose.Schema.Types.ObjectId],
  state: Number,
  tasks: [mongoose.Schema.Types.ObjectId],
  turnoverTime: Number,
  validateStatePeriod: Number,
  voteCommitPeriod: Number,
  voteRevealPeriod: Number,
  weiBal: Number,
  weiCost: Number
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
