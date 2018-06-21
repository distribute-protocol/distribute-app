import { GET_PROPOSED_PROJECTS, PROPOSE_PROJECT } from '../constants/ProjectActionTypes'
import { proposedProjectsReceived, projectProposed } from '../actions/projectActions'
import Operators, { map, mergeMap, flatMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { push } from 'react-router-redux'
import { client } from '../index'
import { merge } from 'rxjs/observable/merge'
import { rr, tr } from '../utilities/blockchain'

import gql from 'graphql-tag'
window.Operators = Operators
window.Observable = Observable
const getProposedProjectsEpic = action$ => {
  return action$.ofType(GET_PROPOSED_PROJECTS).pipe(
    mergeMap(action => {
      return client.query({query: gql`
      { allProjectsinState(state: 1){
          address,
          id,
          ipfsHash,
          nextDeadline,
          reputationBalance,
          reputationCost,
          tokenBalance,
          weiBal,
          weiCost
        }
      }`}
      )
    }),
    map(result => proposedProjectsReceived(result.data.allProjectsinState))
  )
}

const proposeProject = action$ => {
  return action$.ofType(PROPOSE_PROJECT).pipe(
    mergeMap(action =>
      action.collateralType === 'tokens'
      ? Observable.from(tr.proposeProject(action.projObj.cost, action.projObj.stakingEndDate, action.projObj.multiHash, action.txObj))
      : Observable.from(rr.proposeProject(action.projObj.cost, action.projObj.stakingEndDate, action.projObj.multiHash, action.txObj))
    ),
    mergeMap(result => Observable.concat(
      Observable.of(projectProposed(result)),
      Observable.of(push('/stake'))
    ))
  )
}

export default (action$, store) => merge(
  getProposedProjectsEpic(action$, store),
  proposeProject(action$, store)
)
