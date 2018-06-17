import { GET_NETWORK_STATUS, NETWORK_STATUS_RECEIVED } from '../constants/NetworkActionTypes'

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
