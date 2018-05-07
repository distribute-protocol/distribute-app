/* global Headers fetch */

import { GET_TOTAL_TOKENS } from '../constants/GeneralActionTypes'
import { totalTokensReceived } from '../actions/generalActions'

import { combineEpics } from 'redux-observable'
import 'rxjs'
import { Observable } from 'rxjs/Observable'

// import { projectStateEpic } from './project'

const api = {
  fetchTokens: id => {
    let config = {
      method: 'GET',
      headers: new Headers(),
      mode: 'cors',
      cache: 'default'
    }
    const request = fetch('/api/totaltokens', config)
      .then(response => response.json())
    return Observable.from(request)
  }
}

const generalStateEpic = action$ =>
  action$.ofType(GET_TOTAL_TOKENS)
  // pull value from database
    .mergeMap(action =>
      // call database to see if user is already stored
      api.fetchTokens())
    .map(response => totalTokensReceived(response))

export default combineEpics(generalStateEpic)
