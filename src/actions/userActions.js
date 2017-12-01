import { LOGIN_USER, LOGGED_IN_USER, LOGOUT_USER, REGISTER_USER } from '../constants/UserActionTypes'

export function registerUser (credentials) {
  return {
    type: REGISTER_USER,
    credentials
  }
}

export function loginUser (credentials) {
  return {
    type: LOGIN_USER,
    credentials
  }
}

export function loggedInUser (userObj) {
  return {
    type: LOGGED_IN_USER,
    userObj
  }
}

export function logoutUser () {
  return {
    type: LOGOUT_USER
  }
}
