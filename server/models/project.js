const mongoose = require('mongoose')

let projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  activeStatePeriod: Number,
  address: String,
  ipfsHash: String,
  location: [Number],
  name: String,
  nextDeadline: Date,
  passThreshold: Number,
  photo: String,
  proposer: String,
  proposerType: Number,
  reputationBalance: Number,
  reputationCost: Number,
  stakedStatePeriod: Number,
  state: Number,
  summary: String,
  tokenBalance: Number,
  turnoverTime: Number,
  validateStatePeriod: Number,
  voteCommitPeriod: Number,
  voteRevealPeriod: Number,
  weiBal: Number,
  weiCost: Number
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
