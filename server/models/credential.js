const mongoose = require('mongoose')

let credentialSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  context: String,
  type: String,
  address: String,
  avatarId: mongoose.Schema.Types.ObjectId,
  name: String,
  networkAddress: String,
  publicEncKey: String,
  publicKey: String,
  pushToken: String
})

const Credential = mongoose.model('Credential', credentialSchema)

module.exports = Credential
