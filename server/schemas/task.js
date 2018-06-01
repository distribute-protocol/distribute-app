const mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  weighting: Number,
  description: String,
  claimerId: mongoose.Schema.Types.ObjectId,
  claimTime: Date,
  claimed: Boolean,
  markedComplete: Boolean,
  valRewardClaimable: Boolean,    // reward claimable by validator
  workerRewardClaimable: Boolean,   // reward claimable by worker who completed the task
  validators: [{address: mongoose.Schema.Types.ObjectId, amount: Number, direction: Boolean}],
  voters: [{address: mongoose.Schema.Types.ObjectId, amount: Number, commit: Boolean, reveal: Boolean, direction: Boolean, pulled: Boolean}]
})

module.exports = taskSchema
