const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tokenBalance: Number,
  reputationBalance: Number,
  account: String,
  credentials: mongoose.Schema.Types.Mixed,
  projects: {
    proposed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    staked: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    active: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    validating: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    voting: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    complete: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    failed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    expired: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}]
  },
  // figure out how to define objects in an array for the mint events to be of a certain type
  // maybe write schema for that separately - time, quantity, etc
  mintEvents: []
})

module.exports = userSchema
