import { SUBMIT_FINAL_TASK_LIST, CLAIM_TASK, GET_TASKS, SUBMIT_TASK_COMPLETE, VALIDATE_TASK, GET_VALIDATIONS, REWARD_VALIDATOR } from '../constants/TaskActionTypes'
import { finalTaskListSubmitted, taskClaimed, tasksReceived, taskCompleted, taskValidated, validationsReceived, validatorRewarded } from '../actions/taskActions'
import { map, mergeMap, concatMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { client } from '../index'
import { merge } from 'rxjs/observable/merge'
import { tr, rr, pr, T, P } from '../utilities/blockchain'
import { hashTasks } from '../utilities/hashing'
import gql from 'graphql-tag'

const submitFinalTaskListEpic = action$ => {
  let address
  let taskArray
  let txObj
  let tasks
  return action$.ofType(SUBMIT_FINAL_TASK_LIST).pipe(
    mergeMap(action => {
      address = action.address
      txObj = action.txObj
      // get topTaskHash from contract logs
      let query = gql`
      query ($address: String!) {
        project(address: $address){
          topTaskHash
        }
      }`
      return client.query({query: query, variables: {address: address}})
    }),
    // find the prelim task list in the db that matches toptask hash
    mergeMap(result => {
      let query = gql`
      query($address: String!, $topTaskHash: String!) {
        findFinalTaskHash(address: $address, topTaskHash: $topTaskHash) {
          hash,
          content
        }
      }`
      return client.query({query: query, variables: {address: address, topTaskHash: result.data.project.topTaskHash}})
    }),
    mergeMap(result => {
      tasks = result.data.findFinalTaskHash.content
      taskArray = hashTasks(JSON.parse(tasks))
      return Observable.from(pr.submitHashList(address, taskArray, txObj))
    }),
    map(result => finalTaskListSubmitted(address, tasks))
  )
}

const claimTaskEpic = action$ => {
  let address
  let txObj
  let index
  return action$.ofType(CLAIM_TASK).pipe(
    mergeMap(action => {
      address = action.address
      txObj = action.txObj
      index = action.index
      let query = gql`
      query($address: String!, $index: Int!) {
        findTaskByIndex(address: $address, index: $index) {
          description,
          weighting
        }
      }`
      return client.query({query: query, variables: {address: address, index: index}})
    }),
    mergeMap(result => {
      return Observable.from(rr.claimTask(address, index, result.data.findTaskByIndex.description, result.data.findTaskByIndex.weighting, txObj))
    }),
    map(result => taskClaimed(address, index))
  )
}

const getTasksEpic = action$ => {
  let address
  let state
  return action$.ofType(GET_TASKS).pipe(
    mergeMap(action => {
      address = action.projectAddress
      state = action.state
      let query = gql`
      query($address: String!) {
        allTasksinProject(address: $address) {
          id,
          address,
          claimed,
          claimedAt,
          complete,
          description,
          index,
          hash,
          weighting,
          validationRewardClaimable,
          workerRewardClaimable
        }
      }`
      return client.query({query: query, variables: {address: address}}
      )
    }),
    map(result => tasksReceived(address, result.data.allTasksinProject, state))
  )
}

const submitTaskCompleteEpic = action$ => {
  let address
  let index
  return action$.ofType(SUBMIT_TASK_COMPLETE).pipe(
    mergeMap(action => {
      address = action.address
      index = action.index
      return Observable.from(pr.submitTaskComplete(address, index, action.txObj))
    }),
    map(result => taskCompleted(address, index))
  )
}

const validateTaskEpic = action$ => {
  let address
  let index
  let validationState
  let txObj
  return action$.ofType(VALIDATE_TASK).pipe(
    mergeMap(action => {
      address = action.address
      index = action.taskIndex
      validationState = action.validationState
      txObj = action.txObj
      return Observable.from(tr.validateTask(address, index, validationState, action.txObj))
    }),
    mergeMap(result => {
      return Observable.from(P.at(address).tasks(index))
    }),
    mergeMap(result => {
      return Observable.from(T.at(result).validationEntryFee())
    }),
    map(result => taskValidated(address, index, validationState, result, txObj.from))
  )
}

const getValidationsEpic = action$ => {
  let address
  let index
  return action$.ofType(GET_VALIDATIONS).pipe(
    concatMap(action => {
      address = action.projectAddress
      index = action.index
      let query = gql`
      query($address: String!, $index: Int!) {
        getValidations(address: $address, index: $index) {
          id,
          amount,
          user,
          state,
          address
        }
      }`
      return client.query({query: query, variables: {address: address, index: index}}
      )
    }),
    map(result =>
      validationsReceived(address, index, result.data.getValidations)
    )
  )
}

const rewardValidatorEpic = action$ => {
  let address
  let index
  let txObj
  return action$.ofType(REWARD_VALIDATOR).pipe(
    mergeMap(action => {
      address = action.projectAddress
      index = action.index
      txObj = action.txObj
      console.log(address, index, txObj)
      return Observable.from(tr.rewardValidator(address, index, txObj))
    }),
    map(result =>
      validatorRewarded(address, index, result.logs[0].args)
    )
  )
}

// const rewardTaskEpic = action$ => {
//   let address
//   let index
//   let txObj
//   return action$.ofType(REWARD_VALIDATOR).pipe(
//     mergeMap(action => {
//       address = action.projectAddress
//       index = action.index
//       txObj = action.txObj
//       console.log(address, index, txObj)
//       return Observable.from(tr.rewardValidator(address, index, txObj))
//     }),
//     map(result =>
//       validatorRewarded(address, index, result.logs[0].args)
//     )
//   )
// }

export default (action$, store) => merge(
  submitFinalTaskListEpic(action$, store),
  claimTaskEpic(action$, store),
  getTasksEpic(action$, store),
  submitTaskCompleteEpic(action$, store),
  validateTaskEpic(action$, store),
  getValidationsEpic(action$, store),
  rewardValidatorEpic(action$, store)
)
