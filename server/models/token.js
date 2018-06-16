const mongoose = require('mongoose')

let tokenSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tokenBalance: Number,
  reputationBalance: Number,
  account: String,
  credentials: mongoose.Schema.Types.Mixed,
  projects: [mongoose.Schema.Types.ObjectId],
  // figure out how to define objects in an array for the mint events to be of a certain type
  // maybe write schema for that separately - time, quantity, etc
  tokensChanges: [],
  repuationChanges: [],
  tasks: [mongoose.Schema.Types.ObjectId],
  name: String,
  validations: [],
  votes: []
})

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
