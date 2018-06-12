import { GET_PROPOSED_PROJECTS } from '../constants/getters/ProjectGetterActionTypes'
import { proposedProjectsReceived } from '../actions/getters/projectGetterActions'

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

export const getProposedProjectsEpic = action$ =>
  action$.ofType(GET_PROPOSED_PROJECTS).pipe(
    mergeMap(action => Observable.from(fetchService(`/api/projects/all?state=1`))),
    map(res => Observable.of(res)),
    map(result => proposedProjectsReceived(result))
  )
