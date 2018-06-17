import { LOGIN_USER, LOGGED_IN_USER, LOGOUT_USER, REGISTER_USER, GET_USER_STATUS, USER_STATUS_RECEIVED } from '../constants/UserActionTypes'

export function registerUser (credentials, account) {
  return {
    type: REGISTER_USER,
    credentials,
    account
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

export function getUserStatus (userDetails) {
  return {
    type: GET_USER_STATUS,
    payload: userDetails
  }
}

export function userStatusReceived (responseDetails) {
  return {
    type: USER_STATUS_RECEIVED,
    responseDetails
  }
}
