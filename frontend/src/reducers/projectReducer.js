import { PROPOSE_PROJECT } from '../constants/ProjectActionTypes'

const initialState = {
  projects: []
}

export default function projectReducer (state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case PROPOSE_PROJECT:
      console.log('projectReducer.js')
      let temp = state.projects
      temp.push({cost: action.projectDetails.cost, description: action.projectDetails.description})
      return Object.assign({}, state, {projects: temp})
    default:

  }
  return state
}
