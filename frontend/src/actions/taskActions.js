import {
  SUBMIT_FINAL_TASK_LIST,
  FINAL_TASK_LIST_SUBMITTED,
  CLAIM_TASK,
  TASK_CLAIMED,
  TASK_VALIDATED,
  SUBMIT_TASK_COMPLETE,
  TASK_COMPLETED,
  GET_TASKS,
  TASKS_RECEIVED
} from '../constants/TaskActionTypes'
// task actions start at submitFinalTaskList because task contract initialized in this action

export function submitFinalTaskList (address, txObj) {
  return {
    type: SUBMIT_FINAL_TASK_LIST,
    address,
    txObj
  }
}

export function finalTaskListSubmitted (address, tasks) {
  return {
    type: FINAL_TASK_LIST_SUBMITTED,
    address,
    tasks
  }
}

export function claimTask (address, index, txObj) {
  return {
    type: CLAIM_TASK,
    address,
    index,
    txObj
  }
}

export function taskClaimed (address, index) {
  return {
    type: TASK_CLAIMED,
    address,
    index
  }
}

export function taskValidated (validationDetails) {
  return {
    type: TASK_VALIDATED,
    validationDetails
  }
}

export function taskCompleted (taskDetails) {
  return {
    type: TASK_COMPLETED,
    taskDetails
  }
}

export function submitTaskComplete (address, index, txObj) {
  return {
    type: SUBMIT_TASK_COMPLETE,
    address,
    index,
    txObj
  }
}

export function getTasks (projectAddress, state) {
  return {
    type: GET_TASKS,
    projectAddress,
    state
  }
}

export function tasksReceived (projectAddress, taskDetails, state) {
  return {
    type: TASKS_RECEIVED,
    projectAddress,
    taskDetails,
    state
  }
}
