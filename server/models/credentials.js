const mongoose = require('mongoose')

let credentialSchema = mongoose.Schema({
})

const Credential = mongoose.model('Credential', credentialSchema)

module.exports = Credential
