let obj = require('./build/TokenRegistry.json')

const TokenRegistryAddress = obj.networks['1525789804683'].address

const TokenRegistryABI = JSON.stringify(obj.abi)

const TokenRegistryBytecode = obj.bytecode

module.exports = {
  TokenRegistryAddress,
  TokenRegistryABI,
  TokenRegistryBytecode
}
