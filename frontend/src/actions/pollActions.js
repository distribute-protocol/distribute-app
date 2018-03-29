import { VOTE_COMMITTED, VOTE_REVEALED } from '../constants/PollActionTypes'

export function voteCommitted (voteDetails) {
  return {
    type: VOTE_COMMITTED,
    voteDetails
  }
}

export function voteRevealed (voteDetails) {
  return {
    type: VOTE_REVEALED,
    voteDetails
  }
}
