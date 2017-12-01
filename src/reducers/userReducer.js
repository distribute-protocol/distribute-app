import { LOGGED_IN_USER, LOGOUT_USER } from '../constants/UserActionTypes'

const initialState = {
  user: {}
}

export default function userReducer (state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case LOGGED_IN_USER:
      return Object.assign({}, state, {user: action.userObj})
    case LOGOUT_USER:
      return Object.assign({}, state, {user: {}})
    default:

  }
  return state
}
