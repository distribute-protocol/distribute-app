import { GET_TOTAL_TOKENS, TOTAL_TOKENS_RECEIVED } from '../constants/GeneralActionTypes'
const initialState = {
  generalDetails: {
    totalTokens: 0
  }
}

export default function generalReducer (state = initialState, action) {
  let totalTokens
  switch (action.type) {
    case GET_TOTAL_TOKENS:
      console.log('get total tokens')
      return initialState
      // ({status, user, pollID, salt, numTokens} = action.voteDetails)
      // poll = Object.assign({}, state.allUsers[user], {[pollID]: {salt: salt, status: status, numTokens: numTokens}})
      // return updateAllUsers(state, user, poll)
    case TOTAL_TOKENS_RECEIVED:
      totalTokens = action.generalDetails.totalTokens
      console.log('total tokens received')
      return Object.assign({}, state, {totalTokens})
    default:
  }
  return state
}
