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
  USER_VOTES_RECEIVED,
  SAVE_USER_PROFILE,
  SAVED_USER_PROFILE
} from '../constants/UserActionTypes'

export function registerUser (credentials, wallet) {
  return {
    type: REGISTER_USER,
    credentials,
    wallet
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

export function loggedInUser (userObj, avatar) {
  return {
    type: LOGGED_IN_USER,
    userObj,
    avatar
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

export function saveUserProfile (profile) {
  return {
    type: SAVE_USER_PROFILE,
    profile
  }
}

export function savedUserProfile (user) {
  return {
    type: SAVED_USER_PROFILE,
    user
  }
}
