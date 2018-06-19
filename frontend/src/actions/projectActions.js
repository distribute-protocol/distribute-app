import { PROPOSE_PROJECT, SET_PROJECT_TASK_LIST, SET_TASK_SUBMISSION, TASK_CLAIMED, TASKLIST_SUBMITTED, TASK_COMPLETED, UPDATE_PROJECT, TASK_VALIDATED } from '../constants/ProjectActionTypes'
import { GET_PROPOSED_PROJECTS, PROPOSED_PROJECTS_RECEIVED, GET_STAKED_PROJECTS, STAKED_PROJECTS_RECEIVED } from '../constants/ProjectActionTypes'

export function getProposedProjects (price) {
  return {
    type: GET_PROPOSED_PROJECTS,
    price
  }
}

export function proposedProjectsReceived (responseDetails) {
  return {
    type: PROPOSED_PROJECTS_RECEIVED,
    responseDetails
  }
}

export function getStakedProjects (price) {
  return {
    type: GET_PROPOSED_PROJECTS,
    price
  }
}

export function stakedProjectsReceived (responseDetails) {
  return {
    type: PROPOSED_PROJECTS_RECEIVED,
    responseDetails
  }
}

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
