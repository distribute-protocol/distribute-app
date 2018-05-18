import { GET_TOTAL_TOKENS, TOTAL_TOKENS_RECEIVED, GET_USER_TOKENS, USER_TOKENS_RECEIVED } from '../constants/GeneralActionTypes'
import * as _ from 'lodash'

const initialState = {
  totalTokens: 0,
  userTokens: {}
}

export default function generalReducer (state = initialState, action) {
  switch (action.type) {
    // case GET_TOTAL_TOKENS:
    //   console.log('get total tokens')
    //   return state
    case TOTAL_TOKENS_RECEIVED:
      console.log('total tokens received')
      if (action.responseDetails.value[0] === undefined) {
        console.log('something undefined')
        return state
      } else {
        let totalTok = _.reduce(action.responseDetails.value, (sum, i) => { return sum + i.balance }, 0)
        return Object.assign({}, state, {totalTokens: totalTok})
      }
    // case GET_USER_TOKENS:
    //   console.log('get user tokens')
    //   return state
    case USER_TOKENS_RECEIVED:
      console.log('user tokens received')
      if (action.responseDetails.value === undefined) {
        console.log('something undefined')
        return state
      } else {
        console.log(state)
        let userBal = action.responseDetails.value.balance
        let userAccount = action.responseDetails.value.account
        let newUserTokens = Object.assign({}, state.userTokens, {[userAccount]: userBal})
        return Object.assign({}, state, {userTokens: newUserTokens})
      }
    default:
  }
  return state
}
