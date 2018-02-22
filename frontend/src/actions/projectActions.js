import { PROPOSE_PROJECT, SET_PROJECT_TASK_LIST, SET_TASK_SUBMISSION } from '../constants/ProjectActionTypes'

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
