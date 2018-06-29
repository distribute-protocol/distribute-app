import { GET_PROJECTS, PROPOSE_PROJECT, STAKE_PROJECT, UNSTAKE_PROJECT, CHECK_STAKED_STATUS } from '../constants/ProjectActionTypes'
import { projectsReceived, projectProposed, projectStaked, projectUnstaked } from '../actions/projectActions'
import { map, mergeMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { push } from 'react-router-redux'
import { client } from '../index'
import { merge } from 'rxjs/observable/merge'
import { rr, tr, pr } from '../utilities/blockchain'
// import gql from 'graphql-tag'

const getProposedProjectsEpic = action$ => {
  let state
  return action$.ofType(GET_PROJECTS).pipe(
    mergeMap(action => {
      state = action.state
      return client.query({query: action.query}
      )
    }),
    map(result => projectsReceived(state, result.data.allProjectsinState))
  )
}

const proposeProject = action$ =>
  action$.ofType(PROPOSE_PROJECT).pipe(
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

const stakeProject = action$ => {
  let collateralType
  return action$.ofType(STAKE_PROJECT).pipe(
    mergeMap(action => {
      collateralType = action.collateralType
      return action.collateralType === 'tokens'
      ? Observable.from(tr.stakeTokens(action.projectAddress, parseInt(action.value), action.txObj))
      : Observable.from(rr.stakeReputation(action.projectAddress, parseInt(action.value), action.txObj))
    }),
    map(result => projectStaked(collateralType, result))
  )
}

const unstakeProject = action$ => {
  let collateralType
  return action$.ofType(UNSTAKE_PROJECT).pipe(
    mergeMap(action => {
      collateralType = action.collateralType
      return action.collateralType === 'tokens'
      ? Observable.from(tr.unstakeTokens(action.projectAddress, action.value, action.txObj))
      : Observable.from(rr.unstakeReputation(action.projectAddress, action.value, action.txObj))
    }),
    map(result => projectUnstaked(collateralType, result))
  )
}

const checkStakedStatus = action$ =>
  action$.ofType(CHECK_STAKED_STATUS).pipe(
    mergeMap(action => pr.checkStaked(action.projectAddress, action.txObj)),
    // map(result =>
  )

export default (action$, store) => merge(
  getProposedProjectsEpic(action$, store),
  proposeProject(action$, store),
  stakeProject(action$, store),
  unstakeProject(action$, store),
  checkStakedStatus(action$, store)
)
