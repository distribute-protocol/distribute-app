import {
  GET_PROJECT,
  GET_PROJECTS,
  PROPOSE_PROJECT,
  STAKE_PROJECT,
  UNSTAKE_PROJECT,
  CHECK_STAKED_STATUS,
  CHECK_ACTIVE_STATUS,
  REWARD_PROPOSER,
  SUBMIT_HASHED_TASK_LIST,
  SET_TASK_LIST,
  GET_VERIFIED_TASK_LISTS,
  CHECK_VALIDATE_STATUS,
  CHECK_VOTING_STATUS,
  CHECK_FINAL_STATUS
} from '../constants/ProjectActionTypes'
import {
  projectReceived,
  projectsReceived,
  projectStaked,
  projectUnstaked,
  hashedTaskListSubmitted,
  // stakedStatusChecked,
  proposerRewarded,
  // activeStatusChecked,
  taskListSet,
  verifiedTaskListsReceived,
  // finalStatusChecked
  // validateStatusChecked,
  // votingStatusChecked
  projectProposed
} from '../actions/projectActions'
import { map, mergeMap, concatMap } from 'rxjs/operators'
import { merge, EMPTY, of, from, concat } from 'rxjs'
import { push } from 'react-router-redux'
import { client } from '../index'
import { rr, tr, pr, dt, P } from '../utilities/blockchain'
import gql from 'graphql-tag'

const getProjects = action$ => {
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

const getProject = action$ => {
  return action$.ofType(GET_PROJECT).pipe(
    mergeMap(action => {
      let query = gql`
        query ($address: String!) {
          project(address: $address) {
            address,
            id,
            ipfsHash,
            location,
            name
            nextDeadline,
            photo,
            reputationBalance,
            reputationCost,
            nextDeadline,
            summary,
            tokenBalance,
            weiBal,
            weiCost
          }
        }
      `
      return client.query({query, variables: {address: action.address}}
      )
    }),
    map(result => projectReceived(result))
  )
}

const proposeProject = action$ =>
  action$.ofType(PROPOSE_PROJECT).pipe(
    mergeMap(action => {
      return action.collateralType === 'tokens'
        ? from(tr.proposeProject(action.projObj.cost, action.projObj.stakingEndDate, action.projObj.multiHash, action.txObj))
        : from(rr.proposeProject(action.projObj.cost, action.projObj.stakingEndDate, action.projObj.multiHash, action.txObj))
    }),
    map(result => projectProposed(result.tx)
    )
  )

const stakeProject = action$ => {
  let collateralType, stakeResult
  return action$.ofType(STAKE_PROJECT).pipe(
    mergeMap(action => {
      collateralType = action.collateralType
      return action.collateralType === 'tokens'
        ? from(tr.stakeTokens(action.projectAddress, parseInt(action.value, 10), action.txObj))
        : from(rr.stakeReputation(action.projectAddress, parseInt(action.value, 10), action.txObj))
    }),
    mergeMap(result => {
      stakeResult = result
      return from(dt.currentPrice())
    }),
    mergeMap(result => {
      if (stakeResult.logs[0].args.staked === true) {
        return of(push('/add'))
      } else {
        return of(projectStaked(collateralType, stakeResult.logs[0].args, result))
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
        ? from(tr.unstakeTokens(action.projectAddress, parseInt(action.value, 10), action.txObj))
        : from(rr.unstakeReputation(action.projectAddress, parseInt(action.value, 10), action.txObj))
    }),
    map(result => projectUnstaked(collateralType, result.logs[0].args))
  )
}

const checkStakedStatus = action$ => {
  let projectAddress, firstResult
  return action$.ofType(CHECK_STAKED_STATUS).pipe(
    mergeMap(action => {
      projectAddress = action.projectAddress
      return from(pr.checkStaked(action.projectAddress, action.txObj))
    }),
    mergeMap(result => {
      firstResult = result
      return from(P.at(projectAddress).state())
    }),
    mergeMap(state => {
      if (firstResult.logs[0].args.staked === true) {
        return of(push('/add'))
      } else if (state.toNumber() === 8) {
        return of(push('/expired'))
      } else {
        return EMPTY
      }
    })
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
  return action$.ofType(SUBMIT_HASHED_TASK_LIST).pipe(
    mergeMap(action => {
      tasks = JSON.stringify(action.tasks)
      txObj = action.txObj
      projectAddress = action.projectAddress
      taskHash = action.taskListHash
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
    mergeMap(action => {
      return from(pr.addTaskHash(projectAddress, taskHash, txObj))
    }),
    map(result =>
      hashedTaskListSubmitted(tasks, txObj.from, projectAddress, result.logs[1].args.weighting.toNumber() / (10 ** 15)))
  )
}

const getVerifiedTaskLists = action$ => {
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

const checkActiveStatus = action$ => {
  return action$.ofType(CHECK_ACTIVE_STATUS).pipe(
    mergeMap(action => {
      return from(pr.checkActive(action.projectAddress, action.txObj))
    }),
    mergeMap(result => {
      if (result.logs[0].args.active === true) {
        return concat(
          of(push('/claim'))
        )
      } else {
        return EMPTY
      }
    })
  )
}

const rewardProposer = action$ => {
  let projectAddress, txObj
  return action$.ofType(REWARD_PROPOSER).pipe(
    concatMap(action => {
      projectAddress = action.projectAddress
      txObj = action.txObj
      let query = gql`
      query ($address: String!) {
        project(address: $address){
          proposerType
        }
      }`
      return client.query({query: query, variables: {address: projectAddress}})
    }),
    mergeMap(result => {
      return result.data.project.proposerType === 1
        ? from(tr.refundProposer(projectAddress, txObj))
        : from(rr.refundProposer(projectAddress, txObj))
    }),
    map(result => proposerRewarded(projectAddress))
  )
}

const checkValidateStatus = action$ => {
  return action$.ofType(CHECK_VALIDATE_STATUS).pipe(
    mergeMap(action => {
      return from(pr.checkValidate(action.projectAddress, action.txObj))
    }),
    mergeMap(result => concat(
      of(push('/validate'))
    ))
  )
}

const checkVotingStatus = action$ =>
  action$.ofType(CHECK_VOTING_STATUS).pipe(
    mergeMap(action => {
      return from(pr.checkVoting(action.projectAddress, action.txObj))
    }),
    mergeMap(result => {
      return concat(
        of(push('/vote'))
      )
    })
  )

const checkFinalStatus = action$ => {
  return action$.ofType(CHECK_FINAL_STATUS).pipe(
    mergeMap(action => {
      return from(pr.checkEnd(action.projectAddress, action.txObj))
    }),
    mergeMap(result => {
      if (result.logs[0].args.end.toNumber() === 1) {
        return concat(
          of(push('/complete'))
        )
      } else if (result.logs[0].args.end.toNumber() === 2) {
        return concat(
          of(push('/failed'))
        )
      } else {
        return EMPTY
      }
    })
  )
}

export default (action$, store) => merge(
  getProjects(action$, store),
  getProject(action$, store),
  proposeProject(action$, store),
  stakeProject(action$, store),
  unstakeProject(action$, store),
  checkStakedStatus(action$, store),
  checkActiveStatus(action$, store),
  rewardProposer(action$, store),
  submitHashedTaskList(action$, store),
  setTaskList(action$, store),
  getVerifiedTaskLists(action$, store),
  checkValidateStatus(action$, store),
  checkVotingStatus(action$, store),
  checkFinalStatus(action$, store)
)
