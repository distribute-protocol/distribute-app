import {
  LOGIN_USER,
  LOGGED_IN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  REGISTERED_USER,
  GET_USER_STATUS,
  GET_USER_STATUS_WALLET,
  USER_STATUS_RECEIVED,
  GET_USER_VOTES,
  USER_VOTES_RECEIVED
} from '../constants/UserActionTypes'

export function registerUser (credentials, account) {
  return {
    type: REGISTER_USER,
    credentials,
    account
  }
}

export function registeredUser (tx) {
  return {
    type: REGISTERED_USER,
    tx
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

export function getUserStatusWallet (userDetails) {
  return {
    type: GET_USER_STATUS_WALLET,
    payload: userDetails
  }
}

export function userStatusReceived (responseDetails) {
  return {
    type: USER_STATUS_RECEIVED,
    responseDetails
  }
}

export function getUserVotes (account) {
  return {
    type: GET_USER_VOTES,
    account
  }
}

export function userVotesReceived (votes) {
  return {
    type: USER_VOTES_RECEIVED,
    votes
  }
}
