import {
  PROPOSE_PROJECT,
  PROJECT_PROPOSED,
  STAKE_PROJECT,
  PROJECT_STAKED,
  UNSTAKE_PROJECT,
  PROJECT_UNSTAKED,
  CHECK_STAKED_STATUS,
  CHECK_ACTIVE_STATUS,
  SET_TASK_LIST,
  SUBMIT_HASHED_TASK_LIST,
  TASK_LIST_SET,
  // UPDATE_PROJECT,
  GET_PROJECTS,
  PROJECTS_RECEIVED,
  STAKED_STATUS_CHECKED,
  ACTIVE_STATUS_CHECKED,
  HASHED_TASK_LIST_SUBMITTED,
  GET_VERIFIED_TASK_LISTS,
  VERIFIED_TASK_LISTS_RECEIVED
} from '../constants/ProjectActionTypes'

export function proposeProject (collateralType, projObj, txObj) {
  return {
    type: PROPOSE_PROJECT,
    collateralType,
    projObj,
    txObj
  }
}

export function projectProposed (receipt) {
  return {
    type: PROJECT_PROPOSED,
    receipt
  }
}

export function getProjects (state, query) {
  return {
    type: GET_PROJECTS,
    state,
    query
  }
}

export function projectsReceived (state, projects) {
  return {
    type: PROJECTS_RECEIVED,
    state,
    projects
  }
}

export function stakeProject (collateralType, projectAddress, value, txObj) {
  return {
    type: STAKE_PROJECT,
    collateralType,
    projectAddress,
    value,
    txObj
  }
}

export function projectStaked (collateralType, projectAddress, value, txObj) {
  return {
    type: PROJECT_STAKED,
    collateralType,
    projectAddress,
    value,
    txObj
  }
}

export function unstakeProject (collateralType, projectAddress, receipt) {
  return {
    type: UNSTAKE_PROJECT,
    collateralType,
    projectAddress,
    receipt
  }
}

export function projectUnstaked (collateralType, receipt) {
  return {
    type: PROJECT_UNSTAKED,
    collateralType,
    receipt
  }
}

export function checkStakedStatus (projectAddress, txObj) {
  return {
    type: CHECK_STAKED_STATUS,
    projectAddress,
    txObj
  }
}

export function stakedStatusChecked (receipt) {
  return {
    type: STAKED_STATUS_CHECKED,
    receipt
  }
}

export function checkActiveStatus (projectAddress, txObj) {
  return {
    type: CHECK_ACTIVE_STATUS,
    projectAddress,
    txObj
  }
}

export function activeStatusChecked (receipt) {
  return {
    type: ACTIVE_STATUS_CHECKED,
    receipt
  }
}

export function setTaskList (taskDetails, projectAddress, query) {
  return {
    type: SET_TASK_LIST,
    taskDetails,
    projectAddress
  }
}

export function submitHashedTaskList (tasks, taskListHash, projectAddress, txObj) {
  return {
    type: SUBMIT_HASHED_TASK_LIST,
    tasks,
    taskListHash,
    projectAddress,
    txObj
  }
}

export function taskListSet (taskDetails, projectAddress) {
  return {
    type: TASK_LIST_SET,
    taskDetails,
    projectAddress
  }
}

// export function taskCompleted (taskDetails) {
//   return {
//     type: TASK_COMPLETED,
//     taskDetails
//   }
// }

export function hashedTaskListSubmitted (tasks, submitterAddress, projectAddress, receipt) {
  return {
    type: HASHED_TASK_LIST_SUBMITTED,
    tasks,
    submitterAddress,
    projectAddress,
    receipt
  }
}

export function getVerifiedTaskLists (address) {
  return {
    type: GET_VERIFIED_TASK_LISTS,
    address
  }
}

export function verifiedTaskListsReceived (address, result) {
  return {
    type: VERIFIED_TASK_LISTS_RECEIVED,
    address,
    result
  }
}
