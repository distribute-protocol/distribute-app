/* global Headers fetch */

import { GET_TOTAL_TOKENS } from '../constants/GeneralActionTypes'
import { totalTokensReceived } from '../actions/generalActions'

// import 'rxjs'
import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'
const { Observable } = Rx

// import { projectStateEpic } from './project'


let config = {
  method: 'GET',
  headers: new Headers(),
  mode: 'cors',
  cache: 'default'
}

export async function fetchService (url) {
  let response = await fetch(url, config)
  return response.json()
}

const generalStateEpic = action$ =>
  action$.ofType(GET_TOTAL_TOKENS)
  // pull value from database
    .mergeMap(action => Observable.from(fetchService(`/api/totaltokens`))
      .map(res => Observable.of(res))
      // .subscribe(val => { console.log(val); return val })
      .map(result => totalTokensReceived(result))
    )

export default combineEpics(generalStateEpic)
