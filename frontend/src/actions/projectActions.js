import {
  PROPOSE_PROJECT,
  PROJECT_PROPOSED,
  GET_PROPOSED_PROJECTS,
  PROPOSED_PROJECTS_RECEIVED,
  STAKE_PROJECT,
  PROJECT_STAKED,
  UNSTAKE_PROJECT,
  PROJECT_UNSTAKED,
  CHECK_STAKED_STATUS,
  SET_PROJECT_TASK_LIST,
  SET_TASK_SUBMISSION,
  TASK_CLAIMED,
  TASKLIST_SUBMITTED,
  TASK_COMPLETED,
  // UPDATE_PROJECT,
  TASK_VALIDATED,
  GET_STAKED_PROJECTS,
  STAKED_PROJECTS_RECEIVED,
  GET_PROJECTS,
  PROJECTS_RECEIVED

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

export function getProposedProjects () {
  return {
    type: GET_PROPOSED_PROJECTS
  }
}

export function proposedProjectsReceived (responseDetails) {
  return {
    type: PROPOSED_PROJECTS_RECEIVED,
    responseDetails
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

export function projectStaked (collateralType, receipt) {
  return {
    type: PROJECT_STAKED,
    collateralType,
    receipt
  }
}

export function unstakeProject (collateralType, projectAddress, value, txObj) {
  return {
    type: UNSTAKE_PROJECT,
    collateralType,
    projectAddress,
    value,
    txObj
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

export function getStakedProjects (price) {
  return {
    type: GET_STAKED_PROJECTS,
    price
  }
}

export function stakedProjectsReceived (responseDetails) {
  return {
    type: STAKED_PROJECTS_RECEIVED,
    responseDetails
  }
}

export function setProjectTaskList (taskDetails) {
  return {
    type: SET_PROJECT_TASK_LIST,
    taskDetails
  }
}

export function setTaskSubmission (submissionDetails) {
  return {
    type: SET_TASK_SUBMISSION,
    submissionDetails
  }
}

export function taskClaimed (taskDetails) {
  return {
    type: TASK_CLAIMED,
    taskDetails
  }
}

export function taskListSubmitted (taskDetails) {
  return {
    type: TASKLIST_SUBMITTED,
    taskDetails
  }
}

export function taskCompleted (taskDetails) {
  return {
    type: TASK_COMPLETED,
    taskDetails
  }
}

// export function updateProject (address, projObj) {
//   return {
//     type: UPDATE_PROJECT,
//     address,
//     projObj
//   }
// }

export function taskValidated (validationDetails) {
  return {
    type: TASK_VALIDATED,
    validationDetails
  }
}
