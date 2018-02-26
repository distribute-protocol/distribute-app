import { PROPOSE_PROJECT, GET_PROJECT_STATE, PROJECT_STATE_RECEIVED, SET_PROJECT_TASK_LIST, SET_TASK_SUBMISSION, INDICATE_TASK_CLAIMED } from '../constants/ProjectActionTypes'
const initialState = {
  allProjects: {},   // array of objects
  fetching: 'FALSE'
}

export default function projectReducer (state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  let newAllProjects, temp
  switch (action.type) {
    case PROPOSE_PROJECT:
      let newProject = {
        cost: action.projectDetails.cost,
        description: action.projectDetails.description,
        stakingEndDate: action.projectDetails.stakingEndDate,
        address: action.projectDetails.address,
        taskList: [],
        submittedTasks: {}
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
      temp = state.allProjects[action.taskDetails.address]
      // console.log('all projects', state.allProjects)
      temp.taskList = action.taskDetails.taskList
      newAllProjects = Object.assign({}, state.allProjects, {[action.taskDetails.address]: temp})
      // console.log('new object', Object.assign({}, state, {allProjects: newAllProjects}))
      return Object.assign({}, state, {allProjects: newAllProjects})
    case SET_TASK_SUBMISSION:
      temp = state.allProjects[action.submissionDetails.address]
      console.log(temp)
      temp.submittedTasks[action.submissionDetails.submitter] = action.submissionDetails.taskSubmission
      console.log(temp)
      newAllProjects = Object.assign({}, state.allProjects, {[action.submissionDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    case INDICATE_TASK_CLAIMED:
      temp = state.allProjects[action.taskDetails.address]
      console.log(temp)
      temp.taskList[action.taskDetails.index] = Object.assign({}, temp.taskList[action.taskDetails.index], {claimed: true})
      console.log(temp)
      newAllProjects = Object.assign({}, state.allProjects, {[action.taskDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    default:
  }
  return state
}
