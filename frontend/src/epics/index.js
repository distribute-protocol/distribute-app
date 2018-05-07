/* global Headers fetch */

import { GET_TOTAL_TOKENS } from '../constants/GeneralActionTypes'
import { totalTokensReceived } from '../actions/generalActions'

import { combineEpics } from 'redux-observable'
import 'rxjs'
import { Observable } from 'rxjs/Observable'

// import { projectStateEpic } from './project'

const generalStateEpic = action$ =>
  action$.ofType(GET_TOTAL_TOKENS)
  // pull value from database
    .mergeMap(action =>
      // call database to see if user is already stored
      fetch(`/api/totaltokens`, {
        method: 'GET',
        headers: new Headers(),
        mode: 'cors',
        cache: 'default'
      }))
    .map(response => totalTokensReceived(response))

export default combineEpics(generalStateEpic)
