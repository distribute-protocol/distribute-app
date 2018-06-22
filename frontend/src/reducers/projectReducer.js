import { PROJECT_PROPOSED, PROJECTS_RECEIVED } from '../constants/ProjectActionTypes'

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
    case PROJECTS_RECEIVED:
      if (!action.projects.length) {
        return state
      } else {
        return Object.assign({}, state, {[action.state]: action.projects})
      }
    case PROJECT_PROPOSED:
      console.log(action.receipt)
      return state
    default:
  }
  return state
}
