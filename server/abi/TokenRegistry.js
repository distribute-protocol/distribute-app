let obj = require('./build/contracts/TokenRegistry.json')

const TokenRegistryAddress = Object.keys(obj.networks).sort()[Object.keys(obj.networks).length - 1].address

const TokenRegistryABI = obj.abi

const TokenRegistryBytecode = obj.bytecode

module.exports = {
  TokenRegistryAddress,
  TokenRegistryABI,
  TokenRegistryBytecode
}
