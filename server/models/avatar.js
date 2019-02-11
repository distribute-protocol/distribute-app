const mongoose = require('mongoose')

let avatarSchema = mongoose.Schema({
  credentialId: mongoose.Schema.Types.ObjectId,
  uri: String
})

const Avatar = mongoose.model('Avatar', avatarSchema)

module.exports = Avatar
