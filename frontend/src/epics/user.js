import { LOGIN_USER, REGISTER_USER, GET_USER_STATUS, GET_USER_STATUS_WALLET, GET_USER_VOTES, SAVE_USER_PROFILE } from '../constants/UserActionTypes'
import { userStatusReceived, loggedInUser, registerUser, registeredUser, userVotesReceived, savedUserProfile } from '../actions/userActions'
import { from, of, iif, merge } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { client } from '../index'
import { web3, rr } from '../utilities/blockchain'
import gql from 'graphql-tag'

const getUserEpic = action$ => {
  let credentials, accounts, avatar
  web3.eth.getAccounts((err, res) => {
    if (err) return err
    accounts = res
  })
  return action$.ofType(LOGIN_USER).pipe(
    mergeMap(action => {
      credentials = action.credentials
      avatar = action.credentials.avatar.uri
      let query = gql`
        query ($account: String!) {
          user(account: $account) {
            id
            name
            reputationBalance
            tokenBalance
            account
            wallets
          }
        }
      `
      return client.query({ query, variables: { account: credentials.did } })
    }),
    mergeMap(result => {
      return iif(
        () => !result.data.user || result.data.user.reputationBalance === 0,
        of(registerUser(credentials, accounts[0])),
        of(loggedInUser(result, avatar))
      )
    })
  )
}

const registerUserEpic = action$ => {
  let wallet
  return action$.ofType(REGISTER_USER).pipe(
    mergeMap(action => {
      wallet = action.wallet
      let mutation = gql`
        mutation addUser($input: CredentialInput, $wallet: String!) {
          addUser(input: $input, wallet: $wallet) {
            id
          }
        }
      `
      return client.mutate({
        mutation: mutation,
        variables: {
          input: action.credentials,
          wallet: action.wallet
        }
      })
    }),
    mergeMap(result => {
      console.log('there', result)
      return from(rr.register({ from: wallet }))
    }),
    map(result => registeredUser(result.tx))
  )
}

const saveUserProfileEpic = action$ => {
  let profile, accounts
  web3.eth.getAccounts((err, res) => {
    if (err) return err
    accounts = res
  })
  return action$.ofType(SAVE_USER_PROFILE).pipe(
    mergeMap(action => {
      profile = action.profile
      let mutation = gql`
        mutation saveUserProfile($profile: ProfileInput, $wallet: String!) {
          saveUserProfile(profile: $profile, wallet: $wallet) {
            id
          }
        }
      `
      return client.mutate({
        mutation: mutation,
        variables: {
          profile: profile,
          wallet: accounts[0]
        }
      })
    }),
    map(result => savedUserProfile(result))
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
            name
            reputationBalance
            tokenBalance
            account
            wallets
            credentials {
              avatar {
                uri
              }
            }
          }
        }
      `
      return client.query({ query: query, variables: { account: action.payload } })
    }),
    map(result => userStatusReceived(result))
  )

const getUserStatusWalletEpic = action$ =>
  action$.ofType(GET_USER_STATUS_WALLET).pipe(
  // pull value from database
    mergeMap(action => {
      let query = gql`
        query ($wallet: String!) {
          userByWallet(wallet: $wallet) {
            id
            name
            reputationBalance
            tokenBalance
            account
            wallets
            credentials {
              avatar {
                uri
              }
            }
          }
        }
      `
      return client.query({ query: query, variables: { wallet: action.payload } })
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
  getUserStatusWalletEpic(action$, store),
  registerUserEpic(action$, store),
  getUserVotesEpic(action$, store),
  saveUserProfileEpic(action$, store)
)
