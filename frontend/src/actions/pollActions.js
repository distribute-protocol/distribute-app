import { VOTE_COMMITTED, VOTE_REVEALED, VOTE_RESCUED } from '../constants/PollActionTypes'

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

export function voteRescued (voteDetails) {
  return {
    type: VOTE_RESCUED,
    voteDetails
  }
}
