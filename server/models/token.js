const mongoose = require('mongoose')

let tokenSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  ether: String
})

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
