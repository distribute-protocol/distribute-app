import { GET_PROPOSED_PROJECTS, PROPOSED_PROJECTS_RECEIVED } from '../../constants/getters/ProjectGetterActionTypes'

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
