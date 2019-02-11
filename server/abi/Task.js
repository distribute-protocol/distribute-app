let obj = require('./build/contracts/Task.json')

const TaskABI = obj.abi

const TaskBytecode = obj.bytecode

module.exports = {
  TaskABI,
  TaskBytecode
}
