import { PROPOSE_PROJECT, SET_PROJECT_TASK_LIST, SET_TASK_SUBMISSION, INDICATE_TASK_CLAIMED } from '../constants/ProjectActionTypes'

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

export function indicateTaskClaimed (taskDetails) {
  return {
    type: INDICATE_TASK_CLAIMED,
    taskDetails
  }
}
