import { GET_TOTAL_TOKENS, TOTAL_TOKENS_RECEIVED } from '../constants/GeneralActionTypes'
const initialState = {
  generalDetails: {
    totalTokens: 0
  }
}

// async function handlePromise (promise) {
//   let res = await Promise.resolve(promise)
//   return res
// }

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
      console.log('total tokens received')
      // const prom = (x) => { y = Promise.resolve(x) }
      console.log(action.responseDetails.value[0].balance)

      return initialState
      // state = Object.assign({}, state, totalTokens)
      // console.log(state)
    default:
  }
  return state
}
