let obj = require('./build/contracts/DistributeToken.json')

const DistributeTokenAddress = obj.networks['5777'].address

const DistributeTokenABI = JSON.stringify(obj.abi)

const DistributeTokenBytecode = obj.bytecode

module.exports = {
  DistributeTokenAddress,
  DistributeTokenABI,
  DistributeTokenBytecode
}
