import { NETWORK_STATUS_RECEIVED, USER_STATUS_RECEIVED } from '../../constants/getters/StatusGetterActionTypes'
import * as _ from 'lodash'

const initialState = {
  totalTokens: 0,
  totalReputation: 0,
  userTokens: 0,
  userReputation: 0
}

export default function generalReducer (state = initialState, action) {
  switch (action.type) {
    case NETWORK_STATUS_RECEIVED:
      console.log('total tokens received')
      if (action.responseDetails.data.network === undefined) {
        console.log('something undefined')
        return state
      } else {
        let totalTokens = action.responseDetails.data.network.totalTokens
        let totalReputation = action.responseDetails.data.network.totalReputation
        return Object.assign({}, state, {totalTokens: totalTokens, totalReputation: totalReputation})
      }
    case USER_STATUS_RECEIVED:
      console.log('user tokens received')
      if (action.responseDetails.value === undefined) {
        console.log('something undefined')
        return state
      } else {
        console.log(action.responseDetails.value)
        let userTokens = action.responseDetails.value.tokenBalance
        let userReputation = action.responseDetails.value.reputationBalance
        return Object.assign({}, state, {userTokens: userTokens, userReputation: userReputation})
      }
    default:
  }
  return state
}
