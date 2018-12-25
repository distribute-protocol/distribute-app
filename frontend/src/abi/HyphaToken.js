let obj = require('./build/contracts/HyphaToken.json')

const HyphaTokenAddress = obj.networks['5777'].address

const HyphaTokenABI = JSON.stringify(obj.abi)

const HyphaTokenBytecode = obj.bytecode

module.exports = {
  HyphaTokenAddress,
  HyphaTokenABI,
  HyphaTokenBytecode
}
