import { NETWORK_STATUS_RECEIVED } from '../constants/NetworkActionTypes'
import { TOKENS_MINTED, TOKENS_SOLD } from '../constants/TokenActionTypes'

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
    case TOKENS_MINTED:
      return Object.assign({}, state, {totalTokens: state.totalTokens + action.receipt.amountMinted.toNumber()})
    case TOKENS_SOLD:
      return Object.assign({}, state, {totalTokens: state.totalTokens - action.receipt.amountWithdrawn.toNumber()})
    default:
  }
  return state
}
