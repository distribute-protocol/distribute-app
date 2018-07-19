import { SUBMIT_FINAL_TASK_LIST, CLAIM_TASK, GET_TASKS } from '../constants/TaskActionTypes'
import { finalTaskListSubmitted, taskClaimed, tasksReceived } from '../actions/taskActions'
import { map, mergeMap } from 'rxjs/operators'
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
          hash,
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
  return action$.ofType(GET_TASKS).pipe(
    mergeMap(action => {
      address = action.projectAddress
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
          weighting
        }
      }`
      return client.query({query: query, variables: {address: address}}
      )
    }),
    map(result => tasksReceived(address, result.data.allTasksinProject))
  )
}

export default (action$, store) => merge(
  submitFinalTaskListEpic(action$, store),
  claimTaskEpic(action$, store),
  getTasksEpic(action$, store)
)
