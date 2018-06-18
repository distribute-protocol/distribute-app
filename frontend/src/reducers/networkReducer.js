import { NETWORK_STATUS_RECEIVED } from '../constants/NetworkActionTypes'
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
      if (!action.responseDetails.data.network) {
        return state
      } else {
        let totalTokens = action.responseDetails.data.network.totalTokens
        let totalReputation = action.responseDetails.data.network.totalReputation
        return Object.assign({}, state, {totalTokens: totalTokens, totalReputation: totalReputation})
      }
    default:
  }
  return state
}
