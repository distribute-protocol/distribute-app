import { LOGGED_IN_USER, LOGOUT_USER, USER_STATUS_RECEIVED } from '../constants/UserActionTypes'
import { TOKENS_MINTED, TOKENS_SOLD } from '../constants/TokenActionTypes'
const initialState = {}

export default function userReducer (state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN_USER:
      return Object.assign({}, state, {user: action.userObj})
    case LOGOUT_USER:
      return Object.assign({}, state, {user: {}})
    case USER_STATUS_RECEIVED:
      if (!action.responseDetails.data.user) {
        return state
      } else {
        let userTokens = action.responseDetails.data.user.tokenBalance
        let userReputation = action.responseDetails.data.user.reputationBalance
        return Object.assign({}, state, {userTokens: userTokens, userReputation: userReputation})
      }
    case TOKENS_MINTED:
      return Object.assign({}, state, {userTokens: state.userTokens + action.receipt.amountMinted.toNumber()})
    case TOKENS_SOLD:
      return Object.assign({}, state, {userTokens: state.userTokens - action.receipt.amountWithdrawn.toNumber()})
    default:
  }
  return state
}
