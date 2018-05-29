import { NETWORK_STATUS_RECEIVED, USER_STATUS_RECEIVED } from '../../constants/getters/StatusGetterActionTypes'
import * as _ from 'lodash'

const initialState = {
  totalTokens: 0,
  totalReputation: 0,
  userTokens: {},
  userReputation: {}
}

export default function generalReducer (state = initialState, action) {
  switch (action.type) {
    case NETWORK_STATUS_RECEIVED:
      console.log('total tokens received')
      if (action.responseDetails.value === undefined) {
        console.log('something undefined')
        return state
      } else {
        let totalTokens = action.responseDetails.value.totalTokens
        let totalReputation = action.responseDetails.value.totalReputation
        return Object.assign({}, state, {totalTokens: totalTokens, totalReputation: totalReputation})
      }
    case USER_STATUS_RECEIVED:
      console.log('user tokens received')
      if (action.responseDetails.value === undefined) {
        console.log('something undefined')
        return state
      } else {
        console.log(action.responseDetails.value)
        return state
        // let userBal = action.responseDetails.value.balance
        // let userAccount = action.responseDetails.value.account
        // let newUserTokens = Object.assign({}, state.userTokens, {[userAccount]: userBal})
        // return Object.assign({}, state, {userTokens: newUserTokens})
      }
    default:
  }
  return state
}
