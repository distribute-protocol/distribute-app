import { PROPOSE_PROJECT, GET_PROJECT_STATE, PROJECT_STATE_RECEIVED, SET_PROJECT_TASK_LIST, SET_TASK_SUBMISSION, TASK_CLAIMED, TASKLIST_SUBMITTED, TASK_COMPLETED, UPDATE_PROJECT, TASK_VALIDATED } from '../constants/ProjectActionTypes'
const initialState = {
  allProjects: {},
  fetching: 'FALSE'
}

export default function projectReducer (state = initialState, action) {
  let newAllProjects, temp, proj
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
      return Object.assign({}, state, {fetching: 'FALSE'})
    case SET_PROJECT_TASK_LIST:
      temp = state.allProjects[action.taskDetails.address]
      temp.taskList = action.taskDetails.taskList
      newAllProjects = Object.assign({}, state.allProjects, {[action.taskDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    case SET_TASK_SUBMISSION:
      temp = state.allProjects[action.submissionDetails.address]
      temp.submittedTasks[action.submissionDetails.submitter] = action.submissionDetails.taskSubmission
      newAllProjects = Object.assign({}, state.allProjects, {[action.submissionDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    case TASKLIST_SUBMITTED:
      temp = state.allProjects[action.taskDetails.address]
      temp.taskList = action.taskDetails.taskList
      temp = Object.assign({}, temp, {listSubmitted: action.taskDetails.listSubmitted})
      newAllProjects = Object.assign({}, state.allProjects, {[action.taskDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    case TASK_CLAIMED:
      temp = state.allProjects[action.taskDetails.address]
      temp.taskList[action.taskDetails.index] = Object.assign({}, temp.taskList[action.taskDetails.index], {claimed: true})
      newAllProjects = Object.assign({}, state.allProjects, {[action.taskDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    case TASK_COMPLETED:
      temp = state.allProjects[action.taskDetails.address]
      temp.taskList[action.taskDetails.index] = Object.assign({}, temp.taskList[action.taskDetails.index], {submitted: true, validated: {}})
      newAllProjects = Object.assign({}, state.allProjects, {[action.taskDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    case UPDATE_PROJECT:
      proj = Object.assign({}, state.allProjects[action.address], action.projObj)
      newAllProjects = Object.assign({}, state.allProjects, {[action.address]: proj})
      return Object.assign({}, state, {allProjects: newAllProjects})
    case TASK_VALIDATED:
      temp = state.allProjects[action.validationDetails.address]
      temp.taskList[action.validationDetails.index].validated[action.validationDetails.validator] = Object.assign({}, {status: action.validationDetails.status})
      newAllProjects = Object.assign({}, state.allProjects, {[action.validationDetails.address]: temp})
      return Object.assign({}, state, {allProjects: newAllProjects})
    default:
  }
  return state
}
