import { LOGGED_IN_USER, LOGOUT_USER, USER_STATUS_RECEIVED, REGISTERED_USER, USER_VOTES_RECEIVED } from '../constants/UserActionTypes'
import { TOKENS_MINTED, TOKENS_SOLD } from '../constants/TokenActionTypes'
import { VOTE_COMMITTED, VOTE_REVEALED } from '../constants/PollActionTypes'
import * as _ from 'lodash'

const initialState = {
  name: '',
  tokenBalance: 0,
  reputationBalance: 0,
  votes: [],
  avatar: ''
}

export default function userReducer (state = initialState, action) {
  switch (action.type) {
    case REGISTERED_USER:
      return Object.assign({}, state, {reputationBalance: 10000, registering: action.tx})
    case LOGGED_IN_USER:
      return Object.assign({}, state, {user: action.userObj, loggedIn: true})
    case LOGOUT_USER:
      return Object.assign({}, state, {user: {}})
    case USER_STATUS_RECEIVED:
      let user = typeof action.responseDetails.data.userByWallet === 'undefined' ? action.responseDetails.data.user : action.responseDetails.data.userByWallet
      if (!user) {
        return state
      } else {
        let { name, tokenBalance, reputationBalance, account, wallets, credentials } = user
        return Object.assign({}, state, { name, tokenBalance, reputationBalance, account, wallets, avatar: credentials.avatar.uri })
      }
    case TOKENS_MINTED:
      return Object.assign({}, state, {tokenBalance: state.tokenBalance + action.receipt.amountMinted.toNumber()})
    case TOKENS_SOLD:
      return Object.assign({}, state, {tokenBalance: state.tokenBalance - action.receipt.amountWithdrawn.toNumber()})
    case USER_VOTES_RECEIVED:
      return Object.assign({}, state, {votes: action.votes})
    case VOTE_COMMITTED:
      let length = state.votes.length
      let newState = Object.assign([], state.votes, {[length]: {project: action.voteDetails.projectAddress, amount: action.voteDetails.value, task: {index: action.voteDetails.taskIndex}, rescued: false, revealed: false, salt: action.voteDetails.salt, type: action.voteDetails.type, pollID: action.voteDetails.txReceipt.logs[0].args.pollId.toNumber(), vote: action.voteDetails.vote}})
      return Object.assign({}, state, {votes: newState})
    case VOTE_REVEALED:
      let index = _.findIndex(state.votes, function (vote) {
        return vote.task.index === action.voteDetails.taskIndex && vote.project === action.voteDetails.projectAddress
      })
      let vote = Object.assign({}, state.votes[index], {revealed: true})
      newState = Object.assign([], state.votes, {[index]: vote})
      return Object.assign({}, state, {votes: newState})
    default:
  }
  return state
}
