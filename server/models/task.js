const mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  claimed: Boolean,
  claimedAt: Date,
  claimer: mongoose.Schema.Types.ObjectId,
  complete: Boolean,
  description: String,
  projectId: mongoose.Schema.Types.ObjectId,
  validations: [mongoose.Schema.Types.Mixed],
  validationRewardClaimable: Boolean,    // reward claimable by validator
  votes: [mongoose.Schema.Types.Mixed],
  weighting: Number,
  workerRewardClaimable: Boolean   // reward claimable by worker who completed the task
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
