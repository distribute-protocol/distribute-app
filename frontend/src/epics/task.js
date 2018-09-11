import {
  SUBMIT_FINAL_TASK_LIST,
  CLAIM_TASK,
  SUBMIT_TASK_COMPLETE,
  VALIDATE_TASK,
  GET_VALIDATIONS,
  REWARD_VALIDATOR,
  REWARD_TASK,
  GET_USER_VALIDATIONS,
  COMMIT_VOTE,
  REVEAL_VOTE,
  RESCUE_VOTE
} from '../constants/TaskActionTypes'
import {
  finalTaskListSubmitted,
  taskClaimed,
  taskCompleted,
  taskValidated,
  validationsReceived,
  validatorRewarded,
  taskRewarded,
  userValidationsReceived
} from '../actions/taskActions'
import { voteCommitted, voteRevealed, voteRescued } from '../actions/pollActions'
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

const getUserValidationsEpic = action$ => {
  let address, user, state
  return action$.ofType(GET_USER_VALIDATIONS).pipe(
    mergeMap(action => {
      address = action.projectAddress
      user = action.user
      state = action.state
      let query = gql`
      query($address: String!, $user: String!) {
        getUserValidationsinProject(address: $address, user: $user) {
          id,
          amount,
          user,
          task {
            address,
            index
          },
          state,
          address,
          rewarded
        }
      }`
      return client.query({query: query, variables: {address: address, user: user}}
      )
    }),
    map(result => userValidationsReceived(address, user, result.data.getUserValidationsinProject, state))
  )
}

const rewardValidatorEpic = action$ => {
  let address, index, txObj, state
  return action$.ofType(REWARD_VALIDATOR).pipe(
    mergeMap(action => {
      address = action.projectAddress
      index = action.index
      txObj = action.txObj
      state = action.state
      return Observable.from(tr.rewardValidator(address, index, txObj))
    }),
    map(result =>
      validatorRewarded(address, index, result, state)
    )
  )
}

const rewardTaskEpic = action$ => {
  let address
  let index
  let txObj
  let state
  return action$.ofType(REWARD_TASK).pipe(
    mergeMap(action => {
      address = action.projectAddress
      index = action.index
      txObj = action.txObj
      state = action.state
      return Observable.from(rr.rewardTask(address, index, txObj))
    }),
    map(result =>
      taskRewarded(address, index, result, txObj.from, state)
    )
  )
}

const commitVoteEpic = action$ => {
  let projectAddress, taskIndex, value, secretHash, txReceipt, txObj, vote, salt, pollID, type
  return action$.ofType(COMMIT_VOTE).pipe(
    mergeMap(action => {
      projectAddress = action.projectAddress
      taskIndex = action.taskIndex
      value = action.value
      secretHash = action.secretHash
      pollID = action.pollID
      txObj = action.txObj
      vote = action.vote
      salt = action.salt
      type = action.collateralType
      let query = gql`
      query($account: String!, $amount: Int!) {
        getPrevPollID(account: $account, amount: $amount)
      }`
      return client.query({query: query, variables: {account: txObj.from, amount: value}}
      )
    }),
    mergeMap(result => {
      return type === 'tokens'
        ? Observable.from(tr.voteCommit(projectAddress, taskIndex, value, secretHash, result.data.getPrevPollID, txObj))
        : Observable.from(rr.voteCommit(projectAddress, taskIndex, value, secretHash, result.data.getPrevPollID, txObj))
    }),
    mergeMap(result => {
      txReceipt = result
      let mutation = gql`
        mutation addVote($type: String!, $projectAddress: String!, $taskIndex: Int!, $amount: Int!, $vote: String!, $salt: String!, $pollID: Int!, $voter: String!) {
          addVote(type: $type, projectAddress: $projectAddress, taskIndex: $taskIndex, amount: $amount, vote: $vote, salt: $salt, pollID: $pollID, voter: $voter) {
            id
          }
        }
      `
      return client.mutate({
        mutation: mutation,
        variables: {
          projectAddress: projectAddress,
          taskIndex: taskIndex,
          amount: value,
          vote: vote,
          salt: salt,
          pollID: pollID,
          voter: txObj.from,
          type: type
        }
      })
    }),
    map(result =>
      voteCommitted({projectAddress, taskIndex, type, value, salt, voter: txObj.from, txReceipt, vote, pollID})
    )
  )
}

const revealVoteEpic = action$ => {
  let projectAddress, taskIndex, vote, salt, txObj, txReceipt
  return action$.ofType(REVEAL_VOTE).pipe(
    mergeMap(action => {
      projectAddress = action.projectAddress
      taskIndex = action.taskIndex
      vote = action.vote
      salt = action.salt
      txObj = action.txObj
      return action.collateralType === 'tokens'
        ? Observable.from(tr.voteReveal(projectAddress, taskIndex, vote, salt, action.txObj))
        : Observable.from(rr.voteReveal(projectAddress, taskIndex, vote, salt, action.txObj))
    }),
    map(result =>
      voteRevealed({projectAddress, taskIndex, voter: txObj.from, txReceipt, salt})
    )
  )
}

const rescueVoteEpic = action$ => {
  let projectAddress, taskIndex, txReceipt, txObj
  return action$.ofType(RESCUE_VOTE).pipe(
    map(action => {
      projectAddress = action.projectAddress
      taskIndex = action.taskIndex
      txObj = action.txObj
      return action.collateralType === 'tokens'
        ? Observable.from(tr.rescueTokens(projectAddress, taskIndex, action.txObj))
        : Observable.from(rr.rescueTokens(projectAddress, taskIndex, action.txObj))
    }),
    // mergeMap(result => {
    //   txReceipt = result
    //   let mutation = gql`
    //     mutation rescueVote($address: String!, $taskIndex: String!, $vote: String!, $salt: String!, $voter: String!) {
    //       rescueVote(address: $address, taskIndex: $taskIndex, voter: $voter) {
    //         id
    //       }
    //     }
    //   `
    //   return client.mutate({
    //     mutation: mutation,
    //     variables: {
    //       address: projectAddress,
    //       taskIndex: taskIndex,
    //       voter: txObj.from
    //     }
    //   })
    // }),
    map(result =>
      voteRescued({projectAddress, taskIndex, voter: txObj.from, txReceipt})
    )
  )
}

export default (action$, store) => merge(
  submitFinalTaskListEpic(action$, store),
  claimTaskEpic(action$, store),
  submitTaskCompleteEpic(action$, store),
  validateTaskEpic(action$, store),
  getValidationsEpic(action$, store),
  getUserValidationsEpic(action$, store),
  rewardValidatorEpic(action$, store),
  rewardTaskEpic(action$, store),
  commitVoteEpic(action$, store),
  revealVoteEpic(action$, store),
  rescueVoteEpic(action$, store)
)
