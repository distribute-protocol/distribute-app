import NavigationReducer from './NavigationReducer'
import userReducer from './userReducer'
import projectReducer from './projectReducer'
import pollReducer from './pollReducer'
import statusGetterReducer from './getters/statusGetterReducer'
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

const Nemo = combineReducers({
  navigation: NavigationReducer,
  user: userReducer,
  projects: projectReducer,
  polls: pollReducer,
  router: routerReducer,
  status: statusGetterReducer
})

export default Nemo
