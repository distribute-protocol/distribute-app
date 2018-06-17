import { GET_USER_STATUS } from '../constants/UserActionTypes'
import { userStatusReceived } from '../actions/usersActions'
import { map, mergeMap } from 'rxjs/operators'
import { client } from '../index'
import gql from 'graphql-tag'

export const getUserStatusEpic = action$ =>
  action$.ofType(GET_USER_STATUS).pipe(
  // pull value from database
    mergeMap(action => client.query({query: gql`{ user(account: ${action.payload}){ }}`})),
    map(result => userStatusReceived(result))
  )
