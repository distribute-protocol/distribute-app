let obj = require('./build/ReputationRegistry.json')

const ReputationRegistryAddress = obj.networks['1525373980099'].address

const ReputationRegistryABI = JSON.stringify(obj.abi)

const ReputationRegistryBytecode = obj.bytecode

module.exports = {
  ReputationRegistryAddress,
  ReputationRegistryABI,
  ReputationRegistryBytecode
}
