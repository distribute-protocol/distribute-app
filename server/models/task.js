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
  validationRewardClaimable: Boolean, // is the reward claimable by the correct validator?
  validations: [],
  weighting: Number,
  workerRewarded: Boolean, // did the worker pull their reward already?
  workerRewardClaimable: Boolean // is the reward claimable by worker who completed the task?
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
