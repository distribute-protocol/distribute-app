import { PROJECT_PROPOSED, PROJECT_RECEIVED, PROJECTS_RECEIVED, TASK_LIST_SET, HASHED_TASK_LIST_SUBMITTED, PROJECT_STAKED, PROJECT_UNSTAKED, VERIFIED_TASK_LISTS_RECEIVED, PROPOSER_REWARDED } from '../constants/ProjectActionTypes'
import { FINAL_TASK_LIST_SUBMITTED, VALIDATIONS_RECEIVED, TASK_CLAIMED, TASK_COMPLETED, TASK_VALIDATED, VALIDATOR_REWARDED, TASK_REWARDED, USER_VALIDATIONS_RECEIVED } from '../constants/TaskActionTypes'

const initialState = {
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {}
}

export default function projectReducer (state = initialState, action) {
  switch (action.type) {
    case PROJECT_PROPOSED:
      // BROKEN : Doesn't add project correctly to the reducer
      return Object.assign({}, state, {projectProposed: true, txHash: action.receipt})
    case PROJECTS_RECEIVED:
      if (!action.projects.length) {
        return state
      } else {
        let object = action.projects.reduce((obj, item) => (obj[item.address] = item, obj), {})
        return Object.assign({}, state, {[action.state]: object})
      }
    case PROJECT_RECEIVED:
      return Object.assign({}, {project: action.projectDetails})
    case TASK_LIST_SET:
      let project = Object.assign({}, state[2][action.projectAddress], {taskList: action.taskDetails})
      let projects = Object.assign({}, state[2], {[action.projectAddress]: project})
      return Object.assign({}, state, {2: projects})
    case HASHED_TASK_LIST_SUBMITTED:
      let oldSubmissions
      typeof state[2][action.projectAddress].submittedTasks === 'undefined'
        ? oldSubmissions = []
        : oldSubmissions = state[2][action.projectAddress].submittedTasks
      let newSubmissions = oldSubmissions
      let overwrite = oldSubmissions.findIndex(function (element) { return element.submitter === action.submitterAddress })
      if (overwrite === -1) {
        let length = newSubmissions.length
        newSubmissions = Object.assign([], newSubmissions, {[length]: {content: action.tasks, submitter: action.submitterAddress, weighting: action.receipt}})
      } else {
        newSubmissions = Object.assign([], newSubmissions, {[overwrite]: {content: action.tasks, submitter: action.submitterAddress, weighting: action.receipt}})
      }
      project = Object.assign({}, state[2][action.projectAddress], {submittedTasks: newSubmissions})
      projects = Object.assign({}, state[2], {[action.projectAddress]: project})
      return Object.assign({}, state, {2: projects})
    case PROJECT_STAKED:
      if (action.collateralType === 'tokens') {
        // BROKEN: Fails to get 'weiBal'
        let weiChange = parseInt(action.result.weiChange, 10)
        project = Object.assign({}, state[1][action.result.projectAddress], { weiBal: (parseInt(state[1][action.result.projectAddress] && state[1][action.result.projectAddress].weiBal, 10) || 0) + weiChange, currentPrice: action.currentPrice })
      } else if (action.collateralType === 'reputation') {
        let repBalance = parseInt(state[1][action.result.projectAddress].reputationBalance, 10)
        let repStaked = action.result.reputation.toNumber()
        project = Object.assign({}, state[1][action.result.projectAddress], {reputationBalance: repBalance + repStaked, currentPrice: action.currentPrice})
      }
      projects = Object.assign({}, state[1], {[action.result.projectAddress]: project})
      return Object.assign({}, state, {1: projects})
    case PROJECT_UNSTAKED:
      if (action.collateralType === 'tokens') {
        let weiBal = parseInt(state[1][action.result.projectAddress].weiBal, 10)
        let weiChange = parseInt(action.result.weiChange, 10)
        project = Object.assign({}, state[1][action.result.projectAddress], {weiBal: weiBal - weiChange, currentPrice: action.currentPrice})
      } else if (action.collateralType === 'reputation') {
        let repBalance = parseInt(state[1][action.result.projectAddress].reputationBalance, 10)
        let repStaked = action.result.reputation.toNumber()
        project = Object.assign({}, state[1][action.result.projectAddress], {reputationBalance: repBalance - repStaked, currentPrice: action.currentPrice})
      }
      projects = Object.assign({}, state[1], {[action.result.projectAddress]: project})
      return Object.assign({}, state, {1: projects})
    case VERIFIED_TASK_LISTS_RECEIVED:
      project = Object.assign({}, state[2][action.address], {submittedTasks: action.result})
      projects = Object.assign({}, state[2], {[action.address]: project})
      return Object.assign({}, state, {2: projects})
    case PROPOSER_REWARDED:
      project = Object.assign({}, state[2][action.projectAddress], {proposerRewarded: true})
      projects = Object.assign({}, state[2], {[action.projectAddress]: project})
      return Object.assign({}, state, {2: projects})
    case FINAL_TASK_LIST_SUBMITTED:
      project = Object.assign({}, state[3][action.address], {tasks: action.tasks, listSubmitted: true})
      projects = Object.assign({}, state[3], {[action.address]: project})
      return Object.assign({}, state, {3: projects})
    case TASK_CLAIMED:
      let task, tasks
      task = Object.assign({}, state[3][action.address].tasks[action.index], {claimed: true})
      tasks = Object.assign([], state[3][action.address].tasks, {[action.index]: task})
      project = Object.assign({}, state[3][action.address], {tasks: tasks})
      projects = Object.assign({}, state[3], {[action.address]: project})
      return Object.assign({}, state, {3: projects})
    case TASK_COMPLETED:
      task = Object.assign({}, state[3][action.address].tasks[action.index], {complete: true})
      tasks = Object.assign([], state[3][action.address].tasks, {[action.index]: task})
      project = Object.assign({}, state[3][action.address], {tasks: tasks})
      projects = Object.assign({}, state[3], {[action.address]: project})
      return Object.assign({}, state, {3: projects})
    // called for every task
    case VALIDATIONS_RECEIVED:
      let validation = []
      // action.result.length is the number of validations for this task
      for (let i = 0; i < action.result.length; i++) {
        validation = Object.assign(validation, {[i]: {amount: action.result[i].amount, state: action.result[i].state, user: action.result[i].user}})
      }
      task = Object.assign({}, state[4][action.projectAddress].tasks[action.index], {validations: validation})
      tasks = Object.assign([], state[4][action.projectAddress].tasks, {[action.index]: task})
      project = Object.assign({}, state[4][action.projectAddress], {tasks: tasks})
      projects = Object.assign({}, state[4], {[action.projectAddress]: project})
      return Object.assign({}, state, {4: projects})
    case USER_VALIDATIONS_RECEIVED:
      let valRewarded = []
      for (let i = 0; i < action.result.length; i++) {
        valRewarded = Object.assign(valRewarded, {[action.result[i].task.index]: {state: action.result[i].state, rewarded: action.result[i].rewarded}})
      }
      project = Object.assign({}, state[action.state][action.projectAddress], {valRewarded: valRewarded})
      projects = Object.assign({}, state[action.state], {[action.projectAddress]: project})
      return Object.assign({}, state, {[action.state]: projects})
    case TASK_VALIDATED:
      validation = Object.assign([], state[4][action.address].tasks[action.taskIndex].validations, {[state[4][action.address].tasks[action.taskIndex].validations.length]: {amount: action.valFee.toNumber(), state: action.validationState, user: action.validator}})
      task = Object.assign({}, state[4][action.address].tasks[action.taskIndex], {validations: validation})
      tasks = Object.assign([], state[4][action.address].tasks, {[action.taskIndex]: task})
      project = Object.assign({}, state[4][action.address], {tasks: tasks})
      projects = Object.assign({}, state[4], {[action.address]: project})
      return Object.assign({}, state, {4: projects})
    case VALIDATOR_REWARDED:
      valRewarded = Object.assign(state[action.state][action.projectAddress].valRewarded, {[action.index]: {rewarded: true}})
      project = Object.assign({}, state[action.state][action.projectAddress], {valRewarded: valRewarded})
      projects = Object.assign({}, state[action.state], {[action.projectAddress]: project})
      return Object.assign({}, state, {[action.state]: projects})
    case TASK_REWARDED:
      task = Object.assign({}, state[action.state][action.projectAddress].tasks[action.index], {workerRewarded: true})
      tasks = Object.assign([], state[action.state][action.projectAddress].tasks, {[action.index]: task})
      project = Object.assign({}, state[action.state][action.projectAddress], {tasks: tasks})
      projects = Object.assign({}, state[action.state], {[action.projectAddress]: project})
      return Object.assign({}, state, {[action.state]: projects})
    default:
  }
  return state
}
