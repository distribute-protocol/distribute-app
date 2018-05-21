import { TOTAL_TOKENS_RECEIVED, USER_TOKENS_RECEIVED, TOTAL_REPUTATION_RECEIVED, USER_REPUTATION_RECEIVED } from '../constants/GeneralActionTypes'
import * as _ from 'lodash'

const initialState = {
  totalTokens: 0,
  totalReputation: 0,
  userTokens: {},
  userReputation: {}
}

export default function generalReducer (state = initialState, action) {
  switch (action.type) {
    case TOTAL_TOKENS_RECEIVED:
      console.log('total tokens received')
      if (action.responseDetails.value[0] === undefined) {
        console.log('something undefined')
        return state
      } else {
        let totalTok = _.reduce(action.responseDetails.value, (sum, i) => { return sum + i.balance }, 0)
        return Object.assign({}, state, {totalTokens: totalTok})
      }
    case USER_TOKENS_RECEIVED:
      console.log('user tokens received')
      if (action.responseDetails.value === undefined) {
        console.log('something undefined')
        return state
      } else {
        let userBal = action.responseDetails.value.balance
        let userAccount = action.responseDetails.value.account
        let newUserTokens = Object.assign({}, state.userTokens, {[userAccount]: userBal})
        return Object.assign({}, state, {userTokens: newUserTokens})
      }
    case TOTAL_REPUTATION_RECEIVED:
      console.log('total reputation received')
      if (action.responseDetails.value[0] === undefined) {
        console.log('something undefined')
        return state
      } else {
        let totalRep = _.reduce(action.responseDetails.value, (sum, i) => { return sum + i.reputation }, 0)
        return Object.assign({}, state, {totalReputation: totalRep})
      }
    case USER_REPUTATION_RECEIVED:
      console.log('user reputation received')
      if (action.responseDetails.value === undefined) {
        console.log('something undefined')
        return state
      } else {
        let userRep = action.responseDetails.value.reputation
        let userAccount = action.responseDetails.value.account
        let newUserReputation = Object.assign({}, state.userTokens, {[userAccount]: userRep})
        return Object.assign({}, state, {userReputation: newUserReputation})
      }
    default:
  }
  return state
}
