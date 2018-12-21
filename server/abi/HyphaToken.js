let obj = require('./build/contracts/DistributeToken.json')
//This address lookup is broken...the network id will be different based on where it is being deployed, check this before deployment
const HyphaTokenAddress = obj.networks['5777'].address
//console.log(Object.keys(obj.networks))
const HyphaTokenABI = obj.abi

const HyphaTokenBytecode = obj.bytecode

module.exports = {
  HyphaTokenAddress,
  HyphaTokenABI,
  HyphaTokenBytecode
}
