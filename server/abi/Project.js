let obj = require('./build/contracts/Project.json')

const ProjectABI = obj.abi

const ProjectBytecode = obj.bytecode

module.exports = {
  ProjectABI,
  ProjectBytecode
}
