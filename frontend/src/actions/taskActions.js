import {
  SUBMIT_FINAL_TASK_LIST,
  FINAL_TASK_LIST_SUBMITTED,
  CLAIM_TASK,
  TASK_CLAIMED,
  TASK_VALIDATED,
  TASK_COMPLETED
} from '../constants/TaskActionTypes'
// task actions start at submitFinalTaskList because task contract initialized in this action

export function submitFinalTaskList (address, txObj) {
  console.log('here')
  return {
    type: SUBMIT_FINAL_TASK_LIST,
    address,
    txObj
  }
}

export function finalTaskListSubmitted (address) {
  return {
    type: FINAL_TASK_LIST_SUBMITTED,
    address
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
