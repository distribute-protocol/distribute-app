/* global TextDecoder */

import { GET_PROPOSED_PROJECTS } from '../constants/ProjectActionTypes'
import { proposedProjectsReceived } from '../actions/projectActions'
import { map, mergeMap, concatMap } from 'rxjs/operators'
import { client } from '../index'
import { Observable } from 'rxjs'
import gql from 'graphql-tag'

export const getProposedProjectsEpic = action$ => {
  let price
  return action$.ofType(GET_PROPOSED_PROJECTS).pipe(
    mergeMap(action => {
      price = action.price
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
    // map(proj =>
    //   ipfs.object.get(proj.ipfsHash, (err, node) => {
    //     if (err) {
    //       throw err
    //     }
    //     let dataString = new TextDecoder('utf-8').decode(node.toJSON().data)
    //     proj = Object.assign({}, proj, JSON.parse(dataString), {tokensLeft: Math.ceil((proj.weiCost - proj.weiBal) / price)})
    //     return proj
    //   })
    // ),
    // map(results => console.log('Hi', results))
  )
}

// getproposedProjectReceivedEpic
// process the ipfshash (right now happening in containers/project/1Stake)
