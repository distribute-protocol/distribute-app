import { GET_TOTAL_TOKENS, TOTAL_TOKENS_RECEIVED } from '../constants/GeneralActionTypes'
const initialState = {
  totalTokens: 0
}

// async function handlePromise (promise) {
//   let res = await Promise.resolve(promise)
//   return res
// }

export default function generalReducer (state = initialState, action) {
  let totalTok
  switch (action.type) {
    case GET_TOTAL_TOKENS:
      console.log('get total tokens')
      // let totalTokenSupply = (await dt.totalSupply()).toNumber()

      return initialState
      // ({status, user, pollID, salt, numTokens} = action.voteDetails)
      // poll = Object.assign({}, state.allUsers[user], {[pollID]: {salt: salt, status: status, numTokens: numTokens}})
      // return updateAllUsers(state, user, poll)
    case TOTAL_TOKENS_RECEIVED:
      console.log('total tokens received')
      totalTok = action.responseDetails.value[0].balance
      console.log(totalTok)
      return Object.assign({}, state, {totalTokens: totalTok})
    default:
  }
  return state
}
