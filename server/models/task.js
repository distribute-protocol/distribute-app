const mongoose = require('mongoose')
const taskSchema = require('../schemas/task')

const Project = mongoose.model('Task', taskSchema)

module.exports = Task
