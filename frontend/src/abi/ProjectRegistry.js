let obj = require('./build/ProjectRegistry.json')

const ProjectRegistryAddress = obj.networks['5777'].address

const ProjectRegistryABI = JSON.stringify(obj.abi)

const ProjectRegistryBytecode = obj.bytecode

module.exports = {
  ProjectRegistryAddress,
  ProjectRegistryABI,
  ProjectRegistryBytecode
}
