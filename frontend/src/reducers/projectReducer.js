import { PROJECT_PROPOSED, PROPOSED_PROJECTS_RECEIVED } from '../constants/ProjectActionTypes'

const initialState = {
  projects: []
}
// let receiptHandler = (tx, multiHash) => {
//   let txReceipt = tx.receipt
//   let projectAddress = txReceipt.logs[0].address
//   this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress, ipfsHash: `https://ipfs.io/ipfs/${multiHash}`}))  // this is calling the reducer
//   this.setState({cost: 0, photo: false, imageUrl: false, coords: 0, location: ''})
// }
export default function projectReducer (state = initialState, action) {
  switch (action.type) {
    case PROPOSED_PROJECTS_RECEIVED:
      console.log(action.responseDetails)
      if (!action.responseDetails.length) {
        return state
      } else {
        return Object.assign({}, state, {proposedProjects: action.responseDetails})
      }
    case PROJECT_PROPOSED:
      console.log(action.receipt)
      return state
    default:
  }
  return state
}
