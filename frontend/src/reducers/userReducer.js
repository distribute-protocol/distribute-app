import { LOGGED_IN_USER, LOGOUT_USER, USER_STATUS_RECEIVED } from '../constants/UserActionTypes'

const initialState = {}

export default function userReducer (state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case LOGGED_IN_USER:
      return Object.assign({}, state, {user: action.userObj})
    case LOGOUT_USER:
      return Object.assign({}, state, {user: {}})
    case USER_STATUS_RECEIVED:
      if (typeof action.responseDetails.data.user === 'undefined') {
        return state
      } else {
        let userTokens = action.responseDetails.data.user.tokenBalance
        let userReputation = action.responseDetails.data.user.reputationBalance
        return Object.assign({}, state, {userTokens: userTokens, userReputation: userReputation})
      }
    default:
  }
  return state
}
