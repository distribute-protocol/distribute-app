export const ProjectRegistryAddress = '0xaa588d3737b611bafd7bd713445b314bd453a5c8'
// RINKEBY
// export const ProjectRegistryAddress = '0xef1ac57f437de18c8e5ec168fbe855fc55e238f1'
let obj = require('./build/ProjectRegistry.json')

const ProjectRegistryAddress = obj.networks['5777'].address

const ProjectRegistryABI = JSON.stringify(obj.abi)

const ProjectRegistryBytecode = obj.bytecode

module.exports = {
  ProjectRegistryAddress,
  ProjectRegistryABI,
  ProjectRegistryBytecode
}
