let obj = require('./build/contracts/TokenRegistry.json')

const TokenRegistryAddress = obj.networks['5777'].address

const TokenRegistryABI = obj.abi

const TokenRegistryBytecode = obj.bytecode

module.exports = {
  TokenRegistryAddress,
  TokenRegistryABI,
  TokenRegistryBytecode
}
