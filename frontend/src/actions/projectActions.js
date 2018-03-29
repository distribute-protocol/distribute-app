import { PROPOSE_PROJECT, SET_PROJECT_TASK_LIST, SET_TASK_SUBMISSION, TASK_CLAIMED, TASKLIST_SUBMITTED, TASK_COMPLETED, UPDATE_PROJECT, TASK_VALIDATED, VOTE_COMMITTED, VOTE_REVEALED } from '../constants/ProjectActionTypes'

export function proposeProject (projectDetails) {
  return {
    type: PROPOSE_PROJECT,
    projectDetails
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

export function updateProject (address, projObj) {
  return {
    type: UPDATE_PROJECT,
    address,
    projObj
  }
}

export function taskValidated (validationDetails) {
  return {
    type: TASK_VALIDATED,
    validationDetails
  }
}

export function voteCommitted (voteDetails) {
  return {
    type: VOTE_COMMITTED,
    voteDetails
  }
}

export function voteRevealed (voteDetails) {
  return {
    type: VOTE_REVEALED,
    voteDetails
  }
}
