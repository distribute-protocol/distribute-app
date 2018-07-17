const mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: String,
  claimed: Boolean,
  claimedAt: Date,
  claimer: mongoose.Schema.Types.ObjectId,
  complete: Boolean,
  description: String,
  index: Number,
  hash: String,
  projectId: mongoose.Schema.Types.ObjectId,
  validationRewardClaimable: Boolean, // reward claimable by validator
  weighting: Number,
  workerRewardClaimable: Boolean // reward claimable by worker who completed the task
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
