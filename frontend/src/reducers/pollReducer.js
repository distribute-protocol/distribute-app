import { VOTE_COMMITTED, VOTE_REVEALED } from '../constants/PollActionTypes'

const initialState = {
  allUsers: {}
}

export default function pollReducer (state = initialState, action) {
  let allUsers, poll, voter, status, pollID, salt, numTokens
  let updateAllUsers = (state, user, poll) => {
    allUsers = Object.assign({}, state.allUsers, {[user]: poll})
    return Object.assign({}, state, {allUsers})
  }
  switch (action.type) {
    case VOTE_COMMITTED:
      ({status, voter, pollID, salt, numTokens} = action.voteDetails)
      poll = Object.assign({}, state.allUsers[voter], {[pollID]: {salt: salt, status: status, numTokens: numTokens}})
      return updateAllUsers(state, voter, poll)
    case VOTE_REVEALED:
      console.log('vote revealed')
      return initialState
    default:
  }
  return state
}
