import {
  SUBMIT_FINAL_TASK_LIST,
  FINAL_TASK_LIST_SUBMITTED,
  CLAIM_TASK,
  TASK_CLAIMED,
  VALIDATE_TASK,
  TASK_VALIDATED,
  SUBMIT_TASK_COMPLETE,
  TASK_COMPLETED,
  // GET_TASKS,
  // TASKS_RECEIVED,
  GET_VALIDATIONS,
  VALIDATIONS_RECEIVED,
  REWARD_VALIDATOR,
  VALIDATOR_REWARDED,
  REWARD_TASK,
  TASK_REWARDED,
  GET_USER_VALIDATIONS,
  USER_VALIDATIONS_RECEIVED,
  COMMIT_VOTE,
  REVEAL_VOTE,
  RESCUE_VOTE
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

export function getUserValidations (projectAddress, user) {
  return {
    type: GET_USER_VALIDATIONS,
    projectAddress,
    user
  }
}

export function userValidationsReceived (projectAddress, user, result) {
  return {
    type: USER_VALIDATIONS_RECEIVED,
    projectAddress,
    user,
    result
  }
}

export function rewardValidator (projectAddress, index, txObj) {
  return {
    type: REWARD_VALIDATOR,
    projectAddress,
    index,
    txObj
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

export function rewardTask (projectAddress, index, txObj) {
  return {
    type: REWARD_TASK,
    projectAddress,
    index,
    txObj
  }
}

export function taskRewarded (projectAddress, index, amount, claimer) {
  return {
    type: TASK_REWARDED,
    projectAddress,
    index,
    amount,
    claimer
  }
}

export function commitVote (collateralType, projectAddress, taskIndex, value, secretHash, vote, salt, pollID, txObj) {
  return {
    type: COMMIT_VOTE,
    collateralType,
    projectAddress,
    taskIndex,
    value,
    secretHash,
    vote,
    salt,
    pollID,
    txObj
  }
}

export function revealVote (collateralType, projectAddress, taskIndex, vote, salt, txObj) {
  return {
    type: REVEAL_VOTE,
    collateralType,
    projectAddress,
    taskIndex,
    vote,
    salt,
    txObj
  }
}

export function rescueVote (collateralType, projectAddress, taskIndex, txObj) {
  return {
    type: RESCUE_VOTE,
    collateralType,
    projectAddress,
    taskIndex,
    txObj
  }
}
