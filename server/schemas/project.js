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
  tokenStakers: [{account: mongoose.Schema.Types.ObjectId, ref: 'User', value: Number}],
  reputationStakers: [{account: mongoose.Schema.Types.ObjectId, ref: 'User', value: Number}],
  validators: [{account: mongoose.Schema.Types.ObjectId, ref: 'User', value: Number, direction: Boolean}],
  tokenVoters: [{account: mongoose.Schema.Types.ObjectId, ref: 'User', commit: Boolean, reveal: Boolean, value: Number}],
  reputationVoters: [{account: mongoose.Schema.Types.ObjectId, ref: 'User', commit: Boolean, reveal: Boolean, value: Number}]
})

module.exports = projectSchema
