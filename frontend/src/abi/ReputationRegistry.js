let obj = require('./build/contracts/ReputationRegistry.json')

const ReputationRegistryAddress = Object.keys(obj.networks).sort()[Object.keys(obj.networks).length - 1].address

const ReputationRegistryABI = JSON.stringify(obj.abi)

const ReputationRegistryBytecode = obj.bytecode

module.exports = {
  ReputationRegistryAddress,
  ReputationRegistryABI,
  ReputationRegistryBytecode
}
