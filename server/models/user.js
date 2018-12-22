const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  account: String,
  wallets: [String],
  name: String,
  reputationBalance: Number,
  tokenBalance: Number,
  weiBalance: Number
})

const User = mongoose.model('User', userSchema)

module.exports = User
