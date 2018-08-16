import {
  GET_PROJECTS,
  PROPOSE_PROJECT,
  STAKE_PROJECT,
  UNSTAKE_PROJECT,
  CHECK_STAKED_STATUS,
  CHECK_ACTIVE_STATUS,
  SUBMIT_HASHED_TASK_LIST,
  SET_TASK_LIST,
  GET_VERIFIED_TASK_LISTS,
  CHECK_VALIDATE_STATUS,
  CHECK_VOTING_STATUS
} from '../constants/ProjectActionTypes'
import {
  projectsReceived,
  projectStaked,
  projectUnstaked,
  hashedTaskListSubmitted,
  stakedStatusChecked,
  // activeStatusChecked,
  taskListSet,
  verifiedTaskListsReceived
  // validateStatusChecked,
  // votingStatusChecked
} from '../actions/projectActions'
import { map, mergeMap, concatMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { push } from 'react-router-redux'
import { client } from '../index'
import { merge } from 'rxjs/observable/merge'
import { rr, tr, pr, dt } from '../utilities/blockchain'
import gql from 'graphql-tag'

const getProjectsEpic = action$ => {
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
      Observable.of(push('/stake'))
    ))
  )

const stakeProject = action$ => {
  let collateralType, stakeResult
  return action$.ofType(STAKE_PROJECT).pipe(
    mergeMap(action => {
      collateralType = action.collateralType
      return action.collateralType === 'tokens'
        ? Observable.from(tr.stakeTokens(action.projectAddress, parseInt(action.value, 10), action.txObj))
        : Observable.from(rr.stakeReputation(action.projectAddress, parseInt(action.value, 10), action.txObj))
    }),
    mergeMap(result => {
      stakeResult = result
      return Observable.from(dt.currentPrice())
    }),
    mergeMap(result => {
      if (stakeResult.logs[0].args.staked === true) {
        return Observable.of(push('/add'))
      } else {
        return Observable.of(projectStaked(collateralType, stakeResult.logs[0].args, result))
      }
    })
  )
}

const unstakeProject = action$ => {
  let collateralType
  return action$.ofType(UNSTAKE_PROJECT).pipe(
    mergeMap(action => {
      collateralType = action.collateralType
      return action.collateralType === 'tokens'
        ? Observable.from(tr.unstakeTokens(action.projectAddress, parseInt(action.value, 10), action.txObj))
        : Observable.from(rr.unstakeReputation(action.projectAddress, parseInt(action.value, 10), action.txObj))
    }),
    map(result => projectUnstaked(collateralType, result.logs[0].args))
  )
}

const checkStakedStatus = action$ =>
  action$.ofType(CHECK_STAKED_STATUS).pipe(
    mergeMap(action => {
      return Observable.from(pr.checkStaked(action.projectAddress, action.txObj))
    }),
    map(result => stakedStatusChecked(result))
  )

// set task list on the frontend
const setTaskList = action$ => {
  let taskDetails
  let address
  return action$.ofType(SET_TASK_LIST).pipe(
    mergeMap(action => {
      address = action.projectAddress
      taskDetails = JSON.stringify(action.taskDetails.taskList)
      let mutation = gql`
        mutation addTaskList($input: String!, $address: String!) {
          addTaskList(input: $input, address: $address) {
            id
          }
        }
      `
      return client.mutate({
        mutation: mutation,
        variables: {
          input: taskDetails,
          address: action.projectAddress
        }
      })
    }),
    map(result => taskListSet(taskDetails, address, result.data.addTaskList))
  )
}

const submitHashedTaskList = action$ => {
  let tasks
  let txObj
  let projectAddress
  let taskHash
  let txReceipt
  return action$.ofType(SUBMIT_HASHED_TASK_LIST).pipe(
    mergeMap(action => {
      tasks = JSON.stringify(action.tasks)
      txObj = action.txObj
      projectAddress = action.projectAddress
      taskHash = action.taskListHash
      return Observable.from(pr.addTaskHash(projectAddress, taskHash, txObj))
    }),
    mergeMap(result => {
      txReceipt = result
      let mutation = gql`
        mutation addPrelimTaskList($address: String!, $taskHash: String!, $submitter: String!) {
          addPrelimTaskList(address: $address, taskHash: $taskHash, submitter: $submitter) {
            id
          }
        }
      `
      return client.mutate({
        mutation: mutation,
        variables: {
          address: projectAddress,
          taskHash: taskHash,
          submitter: txObj.from,
          content: tasks
        }
      })
    }),
    map(result =>
      hashedTaskListSubmitted(tasks, txObj.from, projectAddress, txReceipt.logs[1].args))
  )
}

const getVerifiedTaskListsEpic = action$ => {
  let address
  return action$.ofType(GET_VERIFIED_TASK_LISTS).pipe(
    concatMap(action => {
      address = action.address
      let query = gql`
      query ($address: String!) {
        verifiedPrelimTaskLists(address: $address){
          submitter,
          content,
          weighting
        }
      }`
      return client.query({query: query, variables: {address: address}})
    }),
    map(result => verifiedTaskListsReceived(address, result.data.verifiedPrelimTaskLists))
  )
}

const checkActiveStatus = action$ =>
  action$.ofType(CHECK_ACTIVE_STATUS).pipe(
    mergeMap(action => {
      return Observable.from(pr.checkActive(action.projectAddress, action.txObj))
    }),
    mergeMap(result => Observable.concat(
      Observable.of(push('/claim'))
    ))
  )

const checkValidateStatus = action$ => {
  return action$.ofType(CHECK_VALIDATE_STATUS).pipe(
    mergeMap(action => {
      return Observable.from(pr.checkValidate(action.projectAddress, action.txObj))
    }),
    mergeMap(result => Observable.concat(
      Observable.of(push('/validate'))
    ))
  )
}

const checkVotingStatus = action$ =>
  action$.ofType(CHECK_VOTING_STATUS).pipe(
    mergeMap(action => {
      return Observable.from(pr.checkVoting(action.projectAddress, action.txObj))
    }),
    mergeMap(result => Observable.concat(
      Observable.of(push('/vote'))
    ))
  )

export default (action$, store) => merge(
  getProjectsEpic(action$, store),
  proposeProject(action$, store),
  stakeProject(action$, store),
  unstakeProject(action$, store),
  checkStakedStatus(action$, store),
  checkActiveStatus(action$, store),
  submitHashedTaskList(action$, store),
  setTaskList(action$, store),
  getVerifiedTaskListsEpic(action$, store),
  checkValidateStatus(action$, store),
  checkVotingStatus(action$, store)
)
