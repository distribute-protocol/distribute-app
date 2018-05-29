import { GET_NETWORK_STATUS, NETWORK_STATUS_RECEIVED, GET_USER_STATUS, USER_STATUS_RECEIVED } from '../../constants/getters/StatusGetterActionTypes'

export function getNetworkStatus () {
  return {
    type: GET_NETWORK_STATUS
  }
}

export function networkStatusReceived (responseDetails) {
  return {
    type: NETWORK_STATUS_RECEIVED,
    responseDetails
  }
}

export function getUserStatus () {
  return {
    type: GET_USER_STATUS
  }
}

export function userStatusReceived (responseDetails) {
  return {
    type: USER_STATUS_RECEIVED,
    responseDetails
  }
}
