import { GET_TOTAL_TOKENS, TOTAL_TOKENS_RECEIVED, GET_USER_TOKENS, USER_TOKENS_RECEIVED } from '../constants/GeneralActionTypes'

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
  console.log('GOOBI', responseDetails)
  return {
    type: USER_TOKENS_RECEIVED,
    responseDetails
  }
}
