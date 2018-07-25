const mongoose = require('mongoose')

let validatorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  amount: Number,
  state: Boolean,
  taskId: mongoose.Schema.Types.ObjectId,
  userid: mongoose.Schema.Types.ObjectId,
  address: String
})

const Validator = mongoose.model('Validator', validatorSchema)

module.exports = Validator
