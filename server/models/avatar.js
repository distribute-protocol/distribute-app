const mongoose = require('mongoose')

let avatarSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  credentialId: mongoose.Schema.Types.ObjectId,
  uri: String
})

const Avatar = mongoose.model('Avatar', avatarSchema)

module.exports = Avatar
