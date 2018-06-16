const mongoose = require('mongoose')

let reputationSchema = mongoose.Schema({
})

const Reputation = mongoose.model('Reputation', reputationSchema)

module.exports = Reputation
