import { REWARD_VALIDATOR} from '../constants/TaskActionTypes'
import { VALIDATOR_REWARDED } from '../constants/TaskActionTypes'

const initialState = {
}

export default function taskReducer (state = initialState, action) {
  switch (action.type) {
    case VALIDATOR_REWARDED:
      console.log(action)
      let task = Object.assign({}, state[5][action.address].tasks[action.index], {validationRewardClaimable: true})
      let tasks = Object.assign([], state[5][action.address].tasks, {[action.index]: task})
      let project = Object.assign({}, state[5][action.address], {tasks: tasks})
      let projects = Object.assign({}, state[5], {[action.address]: project})
      return Object.assign({}, state, {5: projects})
    default:
      return state
  }
}
