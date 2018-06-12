import { GET_STAKED_PROJECTS, STAKED_PROJECTS_RECEIVED } from '../../constants/getters/ProjectGetterActionTypes'

export function getStakedProjects () {
  return {
    type: GET_STAKED_PROJECTS
  }
}

export function stakedProjectsReceived (responseDetails) {
  return {
    type: STAKED_PROJECTS_RECEIVED,
    responseDetails
  }
}
