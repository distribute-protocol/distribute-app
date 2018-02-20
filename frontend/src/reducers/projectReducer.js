import { PROPOSE_PROJECT, GET_PROJECT_STATE, PROJECT_STATE_RECEIVED, SET_PROJECT_TASK_LIST } from '../constants/ProjectActionTypes'
const initialState = {
  allProjects: {},   // array of objects
  fetching: 'FALSE'
}

export default function projectReducer (state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  let newAllProjects
  switch (action.type) {
    case PROPOSE_PROJECT:
      let newProject = {
        cost: action.projectDetails.cost,
        description: action.projectDetails.description,
        stakingEndDate: action.projectDetails.stakingEndDate,
        address: action.projectDetails.address,
        taskList: []
      }
      newAllProjects = Object.assign({}, state.allProjects, {[action.projectDetails.address]: newProject})
      return Object.assign({}, state, {allProjects: newAllProjects})
      // console.log(state.allProjects
    case GET_PROJECT_STATE:
      return Object.assign({}, state, {fetching: 'TRUE'})
    case PROJECT_STATE_RECEIVED:
      // return Object.assign({}, state, {project: action.payload})
      return Object.assign({}, state, {fetching: 'FALSE'})
    case SET_PROJECT_TASK_LIST:
      let temp = state.allProjects[action.taskDetails.address]
      console.log(state.allProjects)
      console.log(action.taskDetails.address)
      temp.taskList = action.taskDetails.taskList
      newAllProjects = Object.assign({}, state.allProjects, {[action.taskDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    default:
  }
  return state
}
