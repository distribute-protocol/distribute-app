import { PROJECTS_RECEIVED, TASK_LIST_SET, HASHED_TASK_LIST_SUBMITTED, PROJECT_STAKED, PROJECT_UNSTAKED, VERIFIED_TASK_LISTS_RECEIVED } from '../constants/ProjectActionTypes'
import { FINAL_TASK_LIST_SUBMITTED, TASKS_RECEIVED, VALIDATIONS_RECEIVED, TASK_CLAIMED, TASK_COMPLETED } from '../constants/TaskActionTypes'

const initialState = {
}

// let receiptHandler = (tx, multiHash) => {
//   let txReceipt = tx.receipt
//   let projectAddress = txReceipt.logs[0].address
//   this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress, ipfsHash: `https://ipfs.io/ipfs/${multiHash}`}))  // this is calling the reducer
//   this.setState({cost: 0, photo: false, imageUrl: false, coords: 0, location: ''})
// }
export default function projectReducer (state = initialState, action) {
  switch (action.type) {
    case PROJECTS_RECEIVED:
      if (!action.projects.length) {
        return state
      } else {
        let object = action.projects.reduce((obj, item) => (obj[item.address] = item, obj), {})
        return Object.assign({}, state, {[action.state]: object})
      }
    case TASK_LIST_SET:
      let project = Object.assign({}, state[2][action.projectAddress], {taskList: action.taskDetails})
      let projects = Object.assign({}, state[2], {[action.projectAddress]: project})
      return Object.assign({}, state, {2: projects})
    case HASHED_TASK_LIST_SUBMITTED:
      let oldSubmissions
      if (typeof state[2][action.projectAddress].submittedTasks === 'undefined') {
        oldSubmissions = []
      } else {
        oldSubmissions = state[2][action.projectAddress].submittedTasks
      }
      let newSubmissions = oldSubmissions
      let overwrite = oldSubmissions.findIndex(function (element) { return element.submitter === action.submitterAddress })
      if (overwrite === -1) {
        let length = newSubmissions.length
        newSubmissions = Object.assign([], newSubmissions, {[length]: {content: action.tasks, submitter: action.submitterAddress, weighting: action.receipt.weighting.toNumber()}})
      } else {
        newSubmissions = Object.assign([], newSubmissions, {[overwrite]: {content: action.tasks, submitter: action.submitterAddress, weighting: action.receipt.weighting.toNumber()}})
      }
      project = Object.assign({}, state[2][action.projectAddress], {submittedTasks: newSubmissions})
      projects = Object.assign({}, state[2], {[action.projectAddress]: project})
      return Object.assign({}, state, {2: projects})
    case PROJECT_STAKED:
      if (action.collateralType === 'tokens') {
        let weiBal = parseInt(state[1][action.result.projectAddress].weiBal)
        let weiChange = parseInt(action.result.weiChange)
        project = Object.assign({}, state[1][action.result.projectAddress], {weiBal: weiBal + weiChange, currentPrice: action.currentPrice})
      } else if (action.collateralType === 'reputation') {
        let repBalance = parseInt(state[1][action.result.projectAddress].reputationBalance)
        let repStaked = action.result.reputation.toNumber()
        project = Object.assign({}, state[1][action.result.projectAddress], {reputationBalance: repBalance + repStaked, currentPrice: action.currentPrice})
      }
      projects = Object.assign({}, state[1], {[action.result.projectAddress]: project})
      return Object.assign({}, state, {1: projects})
    case PROJECT_UNSTAKED:
      if (action.collateralType === 'tokens') {
        let weiBal = parseInt(state[1][action.result.projectAddress].weiBal)
        let weiChange = parseInt(action.result.weiChange)
        project = Object.assign({}, state[1][action.result.projectAddress], {weiBal: weiBal - weiChange, currentPrice: action.currentPrice})
      } else if (action.collateralType === 'reputation') {
        let repBalance = parseInt(state[1][action.result.projectAddress].reputationBalance)
        let repStaked = action.result.reputation.toNumber()
        project = Object.assign({}, state[1][action.result.projectAddress], {reputationBalance: repBalance - repStaked, currentPrice: action.currentPrice})
      }
      projects = Object.assign({}, state[1], {[action.result.projectAddress]: project})
      return Object.assign({}, state, {1: projects})
    case VERIFIED_TASK_LISTS_RECEIVED:
      project = Object.assign({}, state[2][action.address], {submittedTasks: action.result})
      projects = Object.assign({}, state[2], {[action.address]: project})
      return Object.assign({}, state, {2: projects})
    case FINAL_TASK_LIST_SUBMITTED:
      project = Object.assign({}, state[3][action.address], {tasks: action.tasks, listSubmitted: true})
      projects = Object.assign({}, state[3], {[action.address]: project})
      return Object.assign({}, state, {3: projects})
    case TASKS_RECEIVED:
      let currentState = action.state
      let taskDetails = action.taskDetails.slice(0)
      let sortedTasks = taskDetails.sort(function (a, b) {
        return a.index - b.index
      })
      project = Object.assign({}, state[currentState][action.projectAddress], {tasks: sortedTasks})
      projects = Object.assign({}, state[currentState], {[action.projectAddress]: project})
      return Object.assign({}, state, {[currentState]: projects})
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
      let validation
      // action.result.length is the number of validations for this task
      validation = []
      for (let i = 0; i < action.result.length; i++) {
        validation = Object.assign(validation, {[i]: {amount: action.result[i].amount, state: action.result[i].state, user: action.result[i].user}})
      }
      task = Object.assign({}, state[4][action.projectAddress].tasks[action.index], {validations: validation})
      tasks = Object.assign([], state[4][action.projectAddress].tasks, {[action.index]: task})
      project = Object.assign({}, state[4][action.projectAddress], {tasks: tasks})
      projects = Object.assign({}, state[4], {[action.projectAddress]: project})
      return Object.assign({}, state, {4: projects})
    default:
  }
  return state
}
