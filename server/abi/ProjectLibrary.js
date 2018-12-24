let obj = require('./build/contracts/ProjectLibrary.json')

const ProjectLibraryAddress = Object.keys(obj.networks).sort()[Object.keys(obj.networks).length - 1].address

const ProjectLibraryABI = obj.abi

const ProjectLibraryBytecode = obj.deployedBytecode

module.exports = {
  ProjectLibraryAddress,
  ProjectLibraryABI,
  ProjectLibraryBytecode
}
