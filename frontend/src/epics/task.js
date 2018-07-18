import { SUBMIT_FINAL_TASK_LIST, CLAIM_TASK } from '../constants/TaskActionTypes'
import { finalTaskListSubmitted, taskClaimed } from '../actions/taskActions'
import { map, mergeMap, concatMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { push } from 'react-router-redux'
import { client } from '../index'
import { merge } from 'rxjs/observable/merge'
import { rr, pr } from '../utilities/blockchain'
import { hashTasks } from '../utilities/hashing'
import gql from 'graphql-tag'

const submitFinalTaskListEpic = action$ => {
  let address
  let taskArray
  let txObj
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
      taskArray = hashTasks(JSON.parse(result.data.findFinalTaskHash.content))
      return Observable.from(pr.submitHashList(address, taskArray, txObj))
    }),
    map(result => finalTaskListSubmitted(address))
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
      query($address: String!, $index: Number!) {
        findTaskByIndex(address: $address, index: $index) {
          description,
          hash,
          weighting
        }
      }`
      return client.query({query: query, variables: {address: address, index: action.index}})
    }),
    mergeMap(result => {
      let taskHash = hashTasks(result.data.findTaskByIndex.description)
      return rr.claimTask(address, index, taskHash, result.data.findTaskByIndex.weighting, txObj)
    }),
    map(result => taskClaimed(address, index))
  )
}

export default (action$, store) => merge(
  submitFinalTaskListEpic(action$, store),
  claimTaskEpic(action$, store)
)
