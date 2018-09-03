import { LOGGED_IN_USER, LOGOUT_USER, USER_STATUS_RECEIVED, REGISTERED_USER, USER_VOTES_RECEIVED } from '../constants/UserActionTypes'
import { TOKENS_MINTED, TOKENS_SOLD } from '../constants/TokenActionTypes'
const initialState = {
  userTokens: 0,
  userReputation: 0,
  registering: false,
  votes: []
}

export default function userReducer (state = initialState, action) {
  switch (action.type) {
    case REGISTERED_USER:
      return Object.assign({}, state, {userReputation: 10000, registering: true})
    case LOGGED_IN_USER:
      return Object.assign({}, state, {user: action.userObj})
    case LOGOUT_USER:
      return Object.assign({}, state, {user: {}})
    case USER_STATUS_RECEIVED:
      if (!action.responseDetails.data.user) {
        return state
      } else {
        return Object.assign({}, state, {userTokens: action.responseDetails.data.user.tokenBalance, userReputation: action.responseDetails.data.user.reputationBalance})
      }
    case TOKENS_MINTED:
      return Object.assign({}, state, {userTokens: state.userTokens + action.receipt.amountMinted.toNumber()})
    case TOKENS_SOLD:
      return Object.assign({}, state, {userTokens: state.userTokens - action.receipt.amountWithdrawn.toNumber()})
    case USER_VOTES_RECEIVED:
      return Object.assign({}, state, {votes: action.votes})
    default:
  }
  return state
}
