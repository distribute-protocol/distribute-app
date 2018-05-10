// RINKEBY
// export const ProjectRegistryAddress = '0xef1ac57f437de18c8e5ec168fbe855fc55e238f1'
let obj = require('./build/ProjectRegistry.json')

const ProjectRegistryAddress = obj.networks['1525906785792'].address

const ProjectRegistryABI = JSON.stringify(obj.abi)

const ProjectRegistryBytecode = obj.bytecode

module.exports = {
  ProjectRegistryAddress,
  ProjectRegistryABI,
  ProjectRegistryBytecode
}
