import { PROPOSE_PROJECT, SET_PROJECT_TASK_LIST, SET_TASK_SUBMISSION, TASK_CLAIMED, TASKLIST_SUBMITTED, TASK_COMPLETED, UPDATE_PROJECT, TASK_VALIDATED, VOTE_COMMITTED, VOTE_REVEALED } from '../constants/ProjectActionTypes'
const initialState = {
  allProjects: {},
  fetching: 'FALSE'
}

export default function projectReducer (state = initialState, action) {
  let allProjects, project, address, taskList, index
  let updateAllProjects = (state, address, project) => {
    allProjects = Object.assign({}, state.allProjects, {[address]: project})
    return Object.assign({}, state, {allProjects})
  }
  switch (action.type) {
    case PROPOSE_PROJECT:
      ({address} = action.projectDetails)
      allProjects = Object.assign(
        {},
        state.allProjects,
        {[address]: Object.assign({}, {...action.projectDetails}, {taskList: [], submittedTasks: {}})}
      )
      return Object.assign({}, state, {allProjects})
    case UPDATE_PROJECT:
      project = Object.assign({}, state.allProjects[action.address], action.projObj)
      return updateAllProjects(state, action.address, project)
    case SET_PROJECT_TASK_LIST:
      ({address, taskList} = action.taskDetails)
      project = state.allProjects[address]
      project.taskList = taskList
      return updateAllProjects(state, address, project)
    case SET_TASK_SUBMISSION:
      ({address} = action.submissionDetails)
      let {submitter, taskSubmission} = action.submissionDetails
      project = state.allProjects[address]
      project.submittedTasks[submitter] = taskSubmission
      return updateAllProjects(state, address, project)
    case TASKLIST_SUBMITTED:
      ({address, taskList} = action.taskDetails)
      let {listSubmitted} = action.taskDetails
      project = state.allProjects[address]
      project.taskList = taskList
      project.listSubmitted = listSubmitted
      return updateAllProjects(state, address, project)
    case TASK_CLAIMED:
      ({address, index} = action.taskDetails)
      project = state.allProjects[address]
      project.taskList[index].claimed = true
      return updateAllProjects(state, address, project)
    case TASK_COMPLETED:
      ({address, index} = action.taskDetails)
      project = state.allProjects[address]
      project.taskList[index] = Object.assign(
        {},
        project.taskList[index],
        {submitted: true, validated: {}}
      )
      return updateAllProjects(state, address, project)
    case TASK_VALIDATED:
      ({address, index} = action.validationDetails)
      let {validator, status} = action.validationDetails
      project = state.allProjects[address]
      project.taskList[index].validated[validator] = Object.assign({}, {status})
      return updateAllProjects(state, address, project)
    case VOTE_COMMITTED:
      console.log('vote submitted')
      return allProjects
    case VOTE_REVEALED:
      console.log('vote revealed')
      return allProjects
    default:
  }
  return state
}
