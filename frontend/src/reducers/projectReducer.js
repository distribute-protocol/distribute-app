import { PROPOSED_PROJECTS_RECEIVED } from '../constants/getters/ProjectGetterActionTypes'

const initialState = {
  projects: []
}

export default function projectReducer (state = initialState, action) {
  switch (action.type) {
    case PROPOSED_PROJECTS_RECEIVED:
      if (action.responseDetails.value === undefined) {
        return state
      } else {
        return Object.assign({}, state, {projects: action.responseDetails.value})
      }
    default:
  }
  return state
}
