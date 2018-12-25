let obj = require('./build/contracts/ReputationRegistry.json')

const ReputationRegistryAddress = obj.networks['5777'].address

const ReputationRegistryABI = obj.abi

const ReputationRegistryBytecode = obj.bytecode

module.exports = {
  ReputationRegistryAddress,
  ReputationRegistryABI,
  ReputationRegistryBytecode
}
