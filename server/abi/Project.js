let obj = require('./build/Project.json')

const ProjectABI = JSON.stringify(obj.abi)

const ProjectBytecode = obj.bytecode

module.exports = {
  ProjectABI,
  ProjectBytecode
}
