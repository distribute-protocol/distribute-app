const mongoose = require('mongoose')

let StakeSchema = mongoose.Schema({
})

const Stake = mongoose.model('Stake', StakeSchema)

module.exports = Stake
