import { GET_NETWORK_STATUS } from '../constants/NetworkActionTypes'
import { networkStatusReceived } from '../actions/networkActions'
import { map, mergeMap } from 'rxjs/operators'
import { client } from '../index'
import gql from 'graphql-tag'

const networkQuery = gql`
  {
    network {
      totalTokens
      totalReputation
      currentPrice
      ethPrice
      weiBal
    }
  }
`
export const getNetworkStatusEpic = action$ =>
  action$.ofType(GET_NETWORK_STATUS).pipe(
  // pull value from database
    mergeMap(action => client.query({query: networkQuery})),
    map(result => networkStatusReceived(result))
  )
