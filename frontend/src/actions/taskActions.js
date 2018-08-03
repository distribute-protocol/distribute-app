import {
  SUBMIT_FINAL_TASK_LIST,
  FINAL_TASK_LIST_SUBMITTED,
  CLAIM_TASK,
  TASK_CLAIMED,
  VALIDATE_TASK,
  TASK_VALIDATED,
  SUBMIT_TASK_COMPLETE,
  TASK_COMPLETED,
  GET_TASKS,
  TASKS_RECEIVED,
  GET_VALIDATIONS,
  VALIDATIONS_RECEIVED,
  REWARD_VALIDATOR,
  VALIDATOR_REWARDED
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

export function validateTask (address, taskIndex, validationState, txObj) {
  return {
    type: VALIDATE_TASK,
    address,
    taskIndex,
    validationState,
    txObj
  }
}

export function taskValidated (address, taskIndex, validationState, valFee, validator) {
  return {
    type: TASK_VALIDATED,
    address,
    taskIndex,
    validationState,
    valFee,
    validator
  }
}

export function taskCompleted (address, index) {
  return {
    type: TASK_COMPLETED,
    address,
    index
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

export function getValidations (projectAddress, index) {
  return {
    type: GET_VALIDATIONS,
    projectAddress,
    index
  }
}

export function validationsReceived (projectAddress, index, result) {
  return {
    type: VALIDATIONS_RECEIVED,
    projectAddress,
    index,
    result
  }
}

export function rewardValidator (projectAddress, index, amount) {
  return {
    type: REWARD_VALIDATOR,
    projectAddress,
    index,
    amount
  }
}

export function validatorRewarded (projectAddress, index, amount) {
  return {
    type: VALIDATOR_REWARDED,
    projectAddress,
    index,
    amount
  }
}
