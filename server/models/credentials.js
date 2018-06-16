const mongoose = require('mongoose')

let credentialSchema = mongoose.Schema({
  context: String,
  type: String,
  address: String,
  avatar: {
    uri: String
  },
  name: String,
  networkAddress: String,
  publicEncKey: String,
  publicKey: String,
  pushToken: String
})

const Credential = mongoose.model('Credential', credentialSchema)

module.exports = Credential
