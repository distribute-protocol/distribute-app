/* global Headers fetch */

import { GET_TOTAL_TOKENS } from '../constants/GeneralActionTypes'
import { totalTokensReceived } from '../actions/generalActions'

// import 'rxjs'
import { combineEpics } from 'redux-observable'
import Rx from 'rxjs/Rx'

// import { projectStateEpic } from './project'

let httpHeaders = { 'Content-Type': 'application/json' }

let config = {
  method: 'GET',
  headers: new Headers(httpHeaders),
  mode: 'cors',
  cache: 'default'
}

const generalStateEpic = action$ =>
  action$.ofType(GET_TOTAL_TOKENS)
  // pull value from database
    .mergeMap(action =>
      // call database to see if user is already stored
      Rx.Observable.fromPromise(fetch(`/api/totaltokens`, config))
        .map(response => totalTokensReceived(response))
    )

export default combineEpics(generalStateEpic)
