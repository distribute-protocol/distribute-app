let obj = require('./build/TokenRegistry.json')

const TokenRegistryAddress = obj.networks['1525718787247'].address

const TokenRegistryABI = JSON.stringify(obj.abi)

const TokenRegistryBytecode = obj.bytecode

module.exports = {
  TokenRegistryAddress,
  TokenRegistryABI,
  TokenRegistryBytecode
}
