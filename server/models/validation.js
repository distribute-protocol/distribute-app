const mongoose = require('mongoose')

let validatorSchema = mongoose.Schema({
})

const Validator = mongoose.model('Validator', validatorSchema)

module.exports = Validator
