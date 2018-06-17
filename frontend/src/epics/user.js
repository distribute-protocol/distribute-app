import { GET_USER_STATUS } from '../constants/UserActionTypes'
import { userStatusReceived } from '../actions/userActions'
import { map, mergeMap } from 'rxjs/operators'
import { client } from '../index'
import gql from 'graphql-tag'

export const getUserStatusEpic = action$ => {
  return action$.ofType(GET_USER_STATUS).pipe(
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
}
