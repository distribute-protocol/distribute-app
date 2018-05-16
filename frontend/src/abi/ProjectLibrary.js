let obj = require('./build/ProjectLibrary.json')

const ProjectLibraryAddress = obj.networks['5777'].address

const ProjectLibraryABI = JSON.stringify(obj.abi)

const ProjectLibraryBytecode = obj.deployedBytecode

module.exports = {
  ProjectLibraryAddress,
  ProjectLibraryABI,
  ProjectLibraryBytecode
}
