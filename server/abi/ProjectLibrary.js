let obj = require('./build/contracts/ProjectLibrary.json')

const ProjectLibraryAddress = obj.networks['5777'].address

const ProjectLibraryABI = obj.abi

const ProjectLibraryBytecode = obj.deployedBytecode

module.exports = {
  ProjectLibraryAddress,
  ProjectLibraryABI,
  ProjectLibraryBytecode
}
