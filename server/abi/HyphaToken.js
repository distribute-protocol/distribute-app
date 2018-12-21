let obj = require('./build/contracts/DistributeToken.json')

const HyphaTokenAddress = obj.networks['5777'].address

const HyphaTokenABI = obj.abi

const HyphaTokenBytecode = obj.bytecode

module.exports = {
  HyphaTokenAddress,
  HyphaTokenABI,
  HyphaTokenBytecode
}
