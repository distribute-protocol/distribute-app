const mongoose = require('mongoose')

let tokenSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tokenBalance: Number,
  reputationBalance: Number,
  account: String,
  credentials: mongoose.Schema.Types.Mixed,
  projects: [mongoose.Schema.Types.ObjectId],
  tokensChanges: [],
  repuationChanges: [],
  tasks: [mongoose.Schema.Types.ObjectId],
  name: String,
  validations: [],
  votes: []
})

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
