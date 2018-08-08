const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  account: String,
  name: String,
  reputationBalance: Number,
  tokenBalance: Number,
  tasks: [mongoose.Schema.Types.ObjectId],
  validations: [mongoose.Schema.Types.ObjectId],
  weiBalance: Number
})

const User = mongoose.model('User', userSchema)

module.exports = User
