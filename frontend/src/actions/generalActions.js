import { GET_TOTAL_TOKENS, TOTAL_TOKENS_RECEIVED } from '../constants/GeneralActionTypes'

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
