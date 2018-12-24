let obj = require('./build/contracts/HyphaToken.json')

const HyphaTokenAddress = Object.keys(obj.networks).sort()[Object.keys(obj.networks).length - 1].address

const HyphaTokenABI = JSON.stringify(obj.abi)

const HyphaTokenBytecode = obj.bytecode

module.exports = {
  HyphaTokenAddress,
  HyphaTokenABI,
  HyphaTokenBytecode
}
