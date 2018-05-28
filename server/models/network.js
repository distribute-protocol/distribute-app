const mongoose = require('mongoose')
const networkSchema = require('../schemas/network')

const Network = mongoose.model('Network', networkSchema)

module.exports = Network
