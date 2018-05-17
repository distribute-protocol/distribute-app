/* global Headers fetch */

import { GET_TOTAL_TOKENS, GET_USER_TOKENS } from '../constants/GeneralActionTypes'
import { totalTokensReceived, userTokensReceived } from '../actions/generalActions'

// import 'rxjs'
import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
const { Observable } = Rx

// import { projectStateEpic } from './project'

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

const getTotalTokensEpic = action$ =>
  action$.ofType(GET_TOTAL_TOKENS)
  // pull value from database
    .mergeMap(action => Observable.from(fetchService(`/api/totaltokens`))
      .map(res => Observable.of(res))
      .map(result => totalTokensReceived(result))
    )

const getUserTokensEpic = action$ =>
  action$.ofType(GET_USER_TOKENS)
  // pull value from database
    .mergeMap(action => Observable.from(fetchService(`/api/userbalance`))
      .map(res => Observable.of(res))
      .map(result => userTokensReceived(result))
    )

export default combineEpics(getTotalTokensEpic, getUserTokensEpic)
