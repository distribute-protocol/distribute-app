import { PROJECT_PROPOSED, PROJECTS_RECEIVED, STAKED_STATUS_CHECKED, TASKLIST_SUBMITTED } from '../constants/ProjectActionTypes'

const initialState = {
  projects: {}
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
      return state
    case STAKED_STATUS_CHECKED:
      console.log(action.receipt)
      console.log(state)
      // update the project in the state and return the new state with that updated project
      // if the project in the log is no longer in state 1, then attach it to projObj at the correct state using the proper format
      // new obj [action.state] = project object, assign the whole new thing to the states
      // overwrite the key that is the proj former state (object that no longer contains that proj)
      // update the new state -- google how to delete, lodash
      // make sure you dont overwrite any other projects
      return state

    default:
  }
  return state
}
