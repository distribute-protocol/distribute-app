const mongoose = require('mongoose')

let tokenSchema = mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  ether: String
})

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
