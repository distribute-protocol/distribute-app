const mongoose = require('mongoose')

// let userSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   tokenBalance: Number,
//   reputationBalance: Number,
//   account: String,
//   projects: [mongoose.Schema.Types.ObjectId],
//   tokensChanges: [mongoose.Schema.Types.ObjectId],
//   reputationChanges: [mongoose.Schema.Types.ObjectId],
//   tasks: [mongoose.Schema.Types.ObjectId],
//   name: String,
//   validations: [mongoose.Schema.Types.ObjectId],
//   votes: [mongoose.Schema.Types.ObjectId]
// })
let userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  account: String,
  name: String,
  reputationBalance: Number,
  tokenBalance: Number
})

const User = mongoose.model('User', userSchema)

module.exports = User
