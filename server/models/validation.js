const mongoose = require('mongoose')

let validatorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  amount: Number,
  state: Boolean,
  task: mongoose.Schema.Types.ObjectId,
  user: String,
  address: String,
  rewarded: Boolean
})

const Validator = mongoose.model('Validator', validatorSchema)

module.exports = Validator
