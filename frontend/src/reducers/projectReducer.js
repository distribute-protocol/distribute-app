import { PROPOSED_PROJECTS_RECEIVED } from '../constants/ProjectActionTypes'

const initialState = {
  projects: []
}

export default function projectReducer (state = initialState, action) {
  switch (action.type) {
    case PROPOSED_PROJECTS_RECEIVED:
      console.log(action.responseDetails)
      if (!action.responseDetails.length) {
        return state
      } else {
        return Object.assign({}, state, {proposedProjects: action.responseDetails})
      }
    default:
  }
  return state
}
