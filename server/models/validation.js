const mongoose = require('mongoose')

let validationSchema = mongoose.Schema({
  amount: Number,
  state: Boolean,
  task: mongoose.Schema.Types.ObjectId,
  user: String,
  address: String,
  rewarded: Boolean, // did this validator pull their reward if they were allowed to?
  projAddress: String
})

const Validation = mongoose.model('Validation', validationSchema)

module.exports = Validation
