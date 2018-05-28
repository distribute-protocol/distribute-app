const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tokenBalance: Number,
  reputationBalance: Number,
  address: String,
  account: String,
  credentials: mongoose.Schema.Types.Mixed,
  projects: {
    proposed: [mongoose.Schema.Types.Mixed],
    staked: [mongoose.Schema.Types.Mixed],
    active: [mongoose.Schema.Types.Mixed],
    validating: [mongoose.Schema.Types.Mixed],
    voting: [mongoose.Schema.Types.Mixed],
    complete: [mongoose.Schema.Types.Mixed],
    failed: [mongoose.Schema.Types.Mixed],
    expired: [mongoose.Schema.Types.Mixed]
  },
  // figure out how to define objects in an array for the mint events to be of a certain type
  // maybe write schema for that separately - time, quantity, etc
  mintEvents: []
})

module.exports = userSchema
