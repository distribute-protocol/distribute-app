const mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: String,
  claimed: Boolean,
  claimedAt: Date,
  claimer: mongoose.Schema.Types.ObjectId,
  complete: Boolean,
  confirmation: Boolean,
  description: String,
  index: Number,
  hash: String,
  project: mongoose.Schema.Types.ObjectId,
  pollNonce: Number,
  state: Number,
  validationFee: Number,
  validationRewardClaimable: Boolean, // reward claimable by validator
  validations: [],
  weighting: Number,
  workerRewarded: Boolean,
  workerRewardClaimable: Boolean // reward claimable by worker who completed the task
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
