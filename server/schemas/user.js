const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tokenBalance: Number,
  reputationBalance: Number,
  account: String,
  credentials: mongoose.Schema.Types.Mixed,
  projectIds: [mongoose.Schema.Types.ObjectId],
  // figure out how to define objects in an array for the mint events to be of a certain type
  // maybe write schema for that separately - time, quantity, etc
  mintEvents: [],
  claimedTasks: [mongoose.Schema.Types.ObjectId],
  proposedProjects: [String]
})

module.exports = userSchema
