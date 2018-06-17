const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tokenBalance: Number,
  reputationBalance: Number,
  account: String,
  credentials: mongoose.Schema.Types.Mixed,
  projects: [mongoose.Schema.Types.ObjectId],
  tokensChanges: [mongoose.Schema.Types.ObjectId],
  repuationChanges: [mongoose.Schema.Types.ObjectId],
  tasks: [mongoose.Schema.Types.ObjectId],
  name: String,
  validations: [mongoose.Schema.Types.ObjectId],
  votes: [mongoose.Schema.Types.ObjectId]
})

const User = mongoose.model('User', userSchema)

module.exports = User
