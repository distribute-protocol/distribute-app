/* global Headers fetch */

import { GET_TOTAL_TOKENS } from '../constants/GeneralActionTypes'
import { totalTokensReceived } from '../actions/generalActions'

import { combineEpics } from 'redux-observable'
import 'rxjs'
import { Observable } from 'rxjs/Observable'

// import { projectStateEpic } from './project'

let config = {
  method: 'GET',
  headers: new Headers(),
  mode: 'cors',
  cache: 'default'
}

const generalStateEpic = action$ =>
  action$.ofType(GET_TOTAL_TOKENS)
  // pull value from database
    .mergeMap(action =>
      // call database to see if user is already stored
      Observable.fromPromise(fetch(`/api/totaltokens`, config))
        .map(response => totalTokensReceived(response))
    )

export default combineEpics(generalStateEpic)
