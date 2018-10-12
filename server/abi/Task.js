let obj = require('./build/Task.json')

const TaskABI = JSON.stringify(obj.abi)

const TaskBytecode = obj.bytecode

module.exports = {
  TaskABI,
  TaskBytecode
}
