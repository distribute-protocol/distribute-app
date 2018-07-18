import { GET_PROJECTS, PROPOSE_PROJECT, STAKE_PROJECT, UNSTAKE_PROJECT, CHECK_STAKED_STATUS, CHECK_ACTIVE_STATUS, SUBMIT_HASHED_TASK_LIST, SET_TASK_LIST, GET_VERIFIED_TASK_LISTS } from '../constants/ProjectActionTypes'
import { projectsReceived, projectProposed, projectStaked, projectUnstaked, hashedTaskListSubmitted, stakedStatusChecked, activeStatusChecked, taskListSet, verifiedTaskListsReceived } from '../actions/projectActions'
import { map, mergeMap, concatMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { push } from 'react-router-redux'
import { client } from '../index'
import { merge } from 'rxjs/observable/merge'
import { rr, tr, pr } from '../utilities/blockchain'
// import { hashTasksArray, hashTasks } from '../utilities/hashing'
import gql from 'graphql-tag'

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
  let projectAddress
  let value
  let txObj
  return action$.ofType(STAKE_PROJECT).pipe(
    mergeMap(action => {
      collateralType = action.collateralType
      projectAddress = action.projectAddress
      value = action.value
      txObj = action.txObj
      return action.collateralType === 'tokens'
        ? Observable.from(tr.stakeTokens(action.projectAddress, parseInt(action.value), action.txObj))
        : Observable.from(rr.stakeReputation(action.projectAddress, parseInt(action.value), action.txObj))
    }),
    map(result => projectStaked(collateralType, projectAddress, value, txObj))
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
    mergeMap(action => { return pr.checkStaked(action.projectAddress, action.txObj) }),
    map(result => stakedStatusChecked(result))
  )

const getStakedProjectsEpic = action$ => {
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
    mergeMap(action => { return pr.checkActive(action.projectAddress, action.txObj) }),
    map(result => activeStatusChecked(result))
  )

const getActiveProjectsEpic = action$ => {
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

// const submitFinalTaskListEpic = action$ => {
//   let address
//   let taskArray
//   let txObj
//   return action$.ofType(SUBMIT_FINAL_TASK_LIST).pipe(
//     mergeMap(action => {
//       address = action.address
//       txObj = action.txObj
//       // get topTaskHash from contract logs
//       let query = gql`
//       query ($address: String!) {
//         project(address: $address){
//           topTaskHash
//         }
//       }`
//       return client.query({query: query, variables: {address: address}})
//     }),
//     // find the prelim task list in the db that matches toptask hash
//     mergeMap(result => {
//       let query = gql`
//       query($address: String!, $topTaskHash: String!) {
//         findFinalTaskHash(address: $address, topTaskHash: $topTaskHash) {
//           hash,
//           content
//         }
//       }`
//       return client.query({query: query, variables: {address: address, topTaskHash: result.data.project.topTaskHash}})
//     }),
//     mergeMap(result => {
//       taskArray = hashTasks(JSON.parse(result.data.findFinalTaskHash.content))
//       return Observable.from(pr.submitHashList(address, taskArray, txObj))
//     }),
//     map(result => finalTaskListSubmitted(address))
//   )
// }

// const claimTaskEpic = action$ => {
//   let address
//   let txObj
//   let index
//   return action$.ofType(CLAIM_TASK).pipe(
//     mergeMap(action => {
//       address = action.address
//       txObj = action.txObj
//       index = action.index
//       let query = gql`
//       query($address: String!, $index: Number!) {
//         findTaskByIndex(address: $address, index: $index) {
//           description,
//           hash,
//           weighting
//         }
//       }`
//       return client.query({query: query, variables: {address: address, index: action.index}})
//     }),
//     mergeMap(result => {
//       let taskHash = hashTasks(result.data.findTaskByIndex.description)
//       return rr.claimTask(address, index, taskHash, result.data.findTaskByIndex.weighting, txObj)
//     }),
//     map(result => taskClaimed(address, index))
//   )
// }

export default (action$, store) => merge(
  getProposedProjectsEpic(action$, store),
  getStakedProjectsEpic(action$, store),
  proposeProject(action$, store),
  stakeProject(action$, store),
  unstakeProject(action$, store),
  checkStakedStatus(action$, store),
  checkActiveStatus(action$, store),
  submitHashedTaskList(action$, store),
  setTaskList(action$, store),
  getVerifiedTaskListsEpic(action$, store),
  getActiveProjectsEpic(action$, store)
  // submitFinalTaskListEpic(action$, store)
)
