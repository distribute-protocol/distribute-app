const mongoose = require('mongoose')

let projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: String,
  weiCost: Number,
  weiBal: Number,
  reputationCost: Number,
<<<<<<< HEAD
  proposer: String,
  proposerType: String,
  collateral: Number,
=======
  reputationBal: Number,
  state: Number,
>>>>>>> d77890288a1d0ee1f83db0b620bbb7df82493a5f
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
