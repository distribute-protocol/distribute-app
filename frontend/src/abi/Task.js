let obj = require('./build/contracts/Task.json')

const TaskABI = JSON.stringify(obj.abi)

const TaskBytecode = obj.bytecode

module.exports = {
  TaskABI,
  TaskBytecode
}
