import { GET_PROPOSED_PROJECTS } from '../constants/ProjectActionTypes'
import { proposedProjectsReceived } from '../actions/projectActions'
import { map, mergeMap } from 'rxjs/operators'
import { client } from '../index'
import gql from 'graphql-tag'

export const getProposedProjectsEpic = action$ =>
  action$.ofType(GET_PROPOSED_PROJECTS).pipe(
    mergeMap(action => client.query({query: gql`{ user(state: 1){}}`})),
    map(result => proposedProjectsReceived(result))
  )
