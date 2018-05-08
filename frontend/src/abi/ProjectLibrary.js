let obj = require('./build/ProjectLibrary.json')

const ProjectLibraryAddress = obj.networks['1525789804683'].address

const ProjectLibraryABI = JSON.stringify(obj.abi)

const ProjectLibraryBytecode = obj.deployedBytecode

module.exports = {
  ProjectLibraryAddress,
  ProjectLibraryABI,
  ProjectLibraryBytecode
}
