import { PROJECT_PROPOSED, PROJECTS_RECEIVED } from '../constants/ProjectActionTypes'

const initialState = {
  projects: {}
  // weiCost: 0
  // weiBal: 0
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
        return Object.assign({}, state, {[action.state]: object})
      }
    case PROJECT_PROPOSED:
      console.log(action.receipt)
      // return Object.assign({}, state, {weiCost: action.receipt.weiCost})
      return state
    // case PROJECT_STAKED:
    //   console.log(action.receipt)
    //   console.log(action.collateralType)
    //   // Object.assign({}, state, {userTokens: state.userTokens - action.receipt.amountStaked.toNumber()})
    //   return state
    // case PROJECT_UNSTAKED
    //   console.log(action.receipt)
    //   console.log(action.collateralType)
    //   // Object.assign({}, state, {userTokens: state.userTokens + action.receipt.amountStaked.toNumber()})
    //   return state
    // // case STAKED_STATUS_CHECKED
    //   // no longer necessary????
    // // case ACTIVE_STATUS_CHECKED
    //   // no longer necessary????
    // // case TASK_CLAIMED
    // //   console.log(action.taskDetails)
    // // case TASKLIST_SUBMITTED
    // //   console.log(action.taskDetails)
    // // case TASK_COMPLETED
    // //     console.log(taskDetails)
    // // case TASK_VALIDATED
    default:
  }
  return state
}
