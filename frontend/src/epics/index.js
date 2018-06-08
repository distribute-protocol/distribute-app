/* global Headers fetch */

import { GET_NETWORK_STATUS, GET_USER_STATUS } from '../constants/getters/StatusGetterActionTypes'
import { networkStatusReceived, userStatusReceived } from '../actions/getters/statusGetterActions'

import { combineEpics } from 'redux-observable'
import { Observable } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'

let getConfig = {
  method: 'GET',
  headers: new Headers(),
  mode: 'cors',
  cache: 'default'
}

export async function fetchService (url) {
  let response = await fetch(url, getConfig)
  return response.json()
}

const getNetworkStatusEpic = action$ =>
  action$.ofType(GET_NETWORK_STATUS).pipe(
  // pull value from database
    mergeMap(action => Observable.from(fetchService(`/api/network`))),
    map(res => Observable.of(res)),
    map(result => networkStatusReceived(result))
  )

const getUserStatusEpic = action$ =>
  action$.ofType(GET_USER_STATUS).pipe(
  // pull value from database
    mergeMap((action) => Observable.from(fetchService(`/api/user?account=${action.payload}`))),
    map(res => Observable.of(res)),
    map(result => userStatusReceived(result))
  )

export default combineEpics(getNetworkStatusEpic, getUserStatusEpic)
