import { PROPOSE_PROJECT, GET_PROJECT_STATE, PROJECT_STATE_RECEIVED, SET_PROJECT_TASK_LIST } from '../constants/ProjectActionTypes'
const initialState = {
  projects: [],   // array of objects
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
      console.log(state.projects)
      return Object.assign({}, state, {projects: temp})
    case GET_PROJECT_STATE:
      return Object.assign({}, state, {fetching: 'TRUE'})
    case PROJECT_STATE_RECEIVED:
      // return Object.assign({}, state, {project: action.payload})
      return Object.assign({}, state, {fetching: 'FALSE'})
    case SET_PROJECT_TASK_LIST:
      let state2 = state
      let i
      for (i = 0; i < state2.projects.length; i++) {
        if (state2.projects[i].address === action.taskDetails.address) {
          let temp = state2.projects[i].taskList
          if (typeof (temp) === 'undefined') {
            temp = action.taskDetails.taskList
          } else {
            temp = temp.concat(action.taskDetails.taskList)
          }
          state2.projects[i].taskList = temp
        }
      }
      return Object.assign({}, state, state2)
    default:
  }
  return state
}
