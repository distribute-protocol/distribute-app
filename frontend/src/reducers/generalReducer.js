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
      // let totalTokenSupply = (await dt.totalSupply()).toNumber()

      return initialState
      // ({status, user, pollID, salt, numTokens} = action.voteDetails)
      // poll = Object.assign({}, state.allUsers[user], {[pollID]: {salt: salt, status: status, numTokens: numTokens}})
      // return updateAllUsers(state, user, poll)
    case TOTAL_TOKENS_RECEIVED:
      console.log(action.responseDetails)
      // doc.reduce(function (cnt, o) { return cnt + o.balance }, 0)
      // totalTokens = action.responseDetails.totalTokens
      // console.log('total tokens received')
      // return Object.assign({}, state, {totalTokens})
      return initialState
    default:
  }
  return state
}
