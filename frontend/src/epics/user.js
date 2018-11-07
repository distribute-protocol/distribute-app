import { LOGIN_USER, REGISTER_USER, GET_USER_STATUS, GET_USER_VOTES } from '../constants/UserActionTypes'
import { userStatusReceived, loggedInUser, registerUser, registeredUser, userVotesReceived } from '../actions/userActions'
import { from, of, iif, concat, merge } from 'rxjs'
import { map, mergeMap, flatMap } from 'rxjs/operators'
import { client } from '../index'
import { web3, rr } from '../utilities/blockchain'
import { push } from 'react-router-redux'
import gql from 'graphql-tag'
import * as _ from 'lodash'

const getUserEpic = action$ => {
  let credentials
  let accounts
  web3.eth.getAccounts((err, res) => {
    if (err) return err
    accounts = res
  })
  return action$.ofType(LOGIN_USER).pipe(
    mergeMap(action => {
      credentials = action.credentials
      let query = gql`
        query ($account: String!) {
          user(account: $account) {
            id,
            reputationBalance
          }
        }
      `
      return client.query({query, variables: {account: accounts[0]}})
    }),
    flatMap(result => {
      return iif(
        () => !result.data.user || result.data.user.reputationBalance === 0,
        of(registerUser(credentials, accounts[0])),
        concat(
          of(loggedInUser(result)),
          of(push('/status'))
        )
      )
    })
  )
}

const registerUserEpic = action$ => {
  let account
  return action$.ofType(REGISTER_USER).pipe(
    mergeMap(action => {
      account = action.account
      let mutation = gql`
        mutation addUser($input: CredentialInput, $account: String!) {
          addUser(input: $input, account: $account) {
            id
          }
        }
      `
      return client.mutate({
        mutation: mutation,
        variables: {
          input: _.omit(action.credentials, ['@type', '@context']),
          account: action.account
        }
      })
    }),
    map(result => from(rr.register({from: account}))),
    flatMap(result => concat(
      of(registeredUser(result)),
      of(push('/status'))
    ))
  )
}

const getUserStatusEpic = action$ =>
  action$.ofType(GET_USER_STATUS).pipe(
  // pull value from database
    mergeMap(action => {
      let query = gql`
        query ($account: String!) {
          user(account: $account) {
            id
            reputationBalance
            tokenBalance
          }
        }
      `
      return client.query({query: query, variables: {account: action.payload}})
    }),
    map(result => userStatusReceived(result))
  )

const getUserVotesEpic = action$ => {
  let account
  return action$.ofType(GET_USER_VOTES).pipe(
  // pull value from database
    mergeMap(action => {
      account = action.account
      let query = gql`
        query ($account: String!) {
          userVoteRecords(account: $account) {
            id
            pollID
            project
            amount
            rescued
            revealed
            salt
            type
            vote
            task {
              id
              index
            }
          }
        }
      `
      return client.query({query: query, variables: {account: account}})
    }),
    map(result => userVotesReceived(result.data.userVoteRecords))
  )
}

export default (action$, store) => merge(
  getUserEpic(action$, store),
  getUserStatusEpic(action$, store),
  registerUserEpic(action$, store),
  getUserVotesEpic(action$, store)
)
