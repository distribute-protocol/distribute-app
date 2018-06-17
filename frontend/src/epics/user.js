import { LOGIN_USER, REGISTER_USER, GET_USER_STATUS } from '../constants/UserActionTypes'
import { userStatusReceived, loggedInUser, registerUser } from '../actions/userActions'
import { map, mergeMap, mapTo } from 'rxjs/operators'
import { merge } from 'rxjs/observable/merge'
import { client } from '../index'
import { web3, rr } from '../utilities/blockchain'
import { push } from 'react-router-redux'
import gql from 'graphql-tag'

const getUserEpic = action$ => {
  let credentials
  return action$.ofType(LOGIN_USER).pipe(
    mergeMap(action => {
      credentials = action.credentials
      let query = gql`
        query ($account: String!) {
          user(account: $account) {
            id
          }
        }
      `
      return client.query({query: query, variables: {account: web3.eth.accounts[0]}})
    }),
    map(result => { if (result) { return loggedInUser(result) } return registerUser(credentials, web3.eth.accounts[0]) }),
    map(_ => push('/status'))
  )
}

const registerUserEpic = action$ => {
  let account
  return action$.ofType(REGISTER_USER).pipe(
    mergeMap(action => {
      account = action.account
      let mutation = gql`
        mutation addUser($input: Credential!, $account: String!) {
          addUser(input: $input, account: $account) {
            id
            type
          }
        }
      `
      return client.mutate({
        mutation: mutation,
        variables: {
          input: action.credentials,
          account: action.account
        }
      })
    }),
    mapTo(result => rr.register({from: account})),
    mapTo(_ => push('/status'))
  )
}

const getUserStatusEpic = action$ =>
  action$.ofType(GET_USER_STATUS).pipe(
  // pull value from database
    mergeMap(action => {
      let query = gql`
        query ($account: String!) {
          user(account: $account) {
            reputationBalance
            tokenBalance
          }
        }
      `
      return client.query({query: query, variables: {account: action.payload}})
    }),
    map(result => userStatusReceived(result))
  )

export default (action$, store) => merge(
  getUserEpic(action$, store),
  getUserStatusEpic(action$, store),
  registerUserEpic(action$, store)
)
