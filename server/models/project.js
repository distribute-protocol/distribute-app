const mongoose = require('mongoose')
const projectSchema = require('../schemas/project')

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
