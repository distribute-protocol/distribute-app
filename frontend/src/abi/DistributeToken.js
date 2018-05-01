let obj = require('./build/DistributeToken.json')

const DistributeTokenAddress = obj.networks['1525200010312'].address

const DistributeTokenABI = JSON.stringify(obj.abi)

const DistributeTokenBytecode = obj.bytecode

module.exports = {
  DistributeTokenAddress,
  DistributeTokenABI,
  DistributeTokenBytecode
}
