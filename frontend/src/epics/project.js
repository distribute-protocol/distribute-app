import { GET_PROPOSED_PROJECTS } from '../constants/ProjectActionTypes'
import { proposedProjectsReceived } from '../actions/projectActions'
import { map, mergeMap } from 'rxjs/operators'
import { client } from '../index'
import gql from 'graphql-tag'

export const getProposedProjectsEpic = action$ => {
  return action$.ofType(GET_PROPOSED_PROJECTS).pipe(
    mergeMap(action => {
      return client.query({query: gql`
      { allProjectsinState(state: 1){
          address,
          id,
          ipfsHash,
          nextDeadline,
          reputationBalance,
          reputationCost,
          tokenBalance,
          weiBal,
          weiCost
        }
      }`}
      )
    }),
    map(result => proposedProjectsReceived(result.data.allProjectsinState))
  )
}

// getproposedProjectReceivedEpic
// process the ipfshash (right now happening in containers/project/1Stake)
