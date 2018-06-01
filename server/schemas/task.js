const mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  weighting: Number,
  description: String,
  claimerId: mongoose.Schema.Types.ObjectId,
  claimTime: Time,
  claimed: Boolean,
  markedComplete: Boolean,
  claimable: Boolean,
  claimableByRep: Boolean,
  nextDeadline: Date,
  validators: [{address: mongoose.Schema.Types.ObjectId, amount: Number, direction: Boolean}],
  voters: [{address: mongoose.Schema.Types.ObjectId, amount: Number, commit: Boolean, reveal: Boolean, direction: Boolean, pulled: Boolean}]
})

module.exports = taskSchema
