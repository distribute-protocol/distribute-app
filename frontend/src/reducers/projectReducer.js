import { PROJECT_PROPOSED, PROJECTS_RECEIVED, TASKLIST_SUBMITTED, PROJECT_STAKED } from '../constants/ProjectActionTypes'

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
        var object = action.projects.reduce((obj, item) => (obj[item.address] = item, obj), {})
        // object = Object.assign({}, object, {submittedTasks: []})
        return Object.assign({}, state, {[action.state]: object})
      }
    case PROJECT_PROPOSED:
      console.log(action.receipt)
      return state
    case TASKLIST_SUBMITTED:
      let project = Object.assign({}, state[2][action.projectAddress], {taskList: action.taskDetails})
      return Object.assign({}, state, {2: {[action.projectAddress]: project}})
    // case TASK_HASH_SUBMITTED:
    //   return Object.assign({}, state, submitter: {action.userObj})
    case PROJECT_STAKED:
      console.log(action)
      // let repStaked = parseInt(action.value)
      // let repBal = parseInt(state[1][action.projectAddress].reputationBalance)
      let totalRepStaked = parseInt(action.value) + parseInt(state[1][action.projectAddress].reputationBalance)
      console.log(totalRepStaked)
      let updateRepBal = Object.assign({}, state[1][action.projectAddress], {reputation: totalRepStaked})
      return Object.assign({}, state, {1: {[action.projectAddress]: updateRepBal}})
      // return state
    // case PROJECT_UNSTAKED
    //   console.log(action.receipt)
    //   console.log(action.collateralType)
    //   // Object.assign({}, state, {userTokens: state.userTokens + action.receipt.amountStaked.toNumber()})
      // return state
    // case STAKED_STATUS_CHECKED
      // no longer necessary????
    // case ACTIVE_STATUS_CHECKED
      // no longer necessary????
    // case TASK_CLAIMED
    //   console.log(action.taskDetails)
    // case TASK_COMPLETED
    //     console.log(taskDetails)
    // case TASK_VALIDATED
    default:
  }
  return state
}
