import { PROPOSE_PROJECT } from '../constants/ProjectActionTypes'
const GET_PROJECT_STATE = 'GET_PROJECT_STATE'
const initialState = {
  projects: [],
  fetching: 'FALSE'
}

export default function projectReducer (state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case PROPOSE_PROJECT:
      let temp = state.projects
      temp.push({
        cost: action.projectDetails.cost,
        description: action.projectDetails.description,
        stakingEndDate: action.projectDetails.stakingEndDate,
        address: action.projectDetails.address
      })
      return Object.assign({}, state, {projects: temp})
    case GET_PROJECT_STATE:
      return Object.assign({}, state, {fetching: 'TRUE'})
    case 'PROJECT_STATE_RECEIVED':
      // return Object.assign({}, state, {project: action.payload})
      return Object.assign({}, state, {fetching: 'FALSE'})
    default:
  }
  return state
}
