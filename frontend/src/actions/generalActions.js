import { GET_TOTAL_TOKENS, TOTAL_TOKENS_RECEIVED, GET_USER_TOKENS, USER_TOKENS_RECEIVED, GET_TOTAL_REPUTATION, TOTAL_REPUTATION_RECEIVED, GET_USER_REPUTATION, USER_REPUTATION_RECEIVED } from '../constants/GeneralActionTypes'

export function getTotalTokens () {
  return {
    type: GET_TOTAL_TOKENS
  }
}

export function totalTokensReceived (responseDetails) {
  return {
    type: TOTAL_TOKENS_RECEIVED,
    responseDetails
  }
}

export function getUserTokens (userDetails) {
  return {
    type: GET_USER_TOKENS,
    userDetails
  }
}

export function userTokensReceived (responseDetails) {
  return {
    type: USER_TOKENS_RECEIVED,
    responseDetails
  }
}

export function getTotalReputation () {
  return {
    type: GET_TOTAL_REPUTATION
  }
}

export function totalReputationReceived (responseDetails) {
  return {
    type: TOTAL_REPUTATION_RECEIVED,
    responseDetails
  }
}

export function getUserReputation (userDetails) {
  return {
    type: GET_USER_REPUTATION,
    userDetails
  }
}

export function userReputationReceived (responseDetails) {
  return {
    type: USER_REPUTATION_RECEIVED,
    responseDetails
  }
}
