import NavigationReducer from './NavigationReducer'
import userReducer from './userReducer'
import pollReducer from './pollReducer'
import statusGetterReducer from './getters/statusGetterReducer'
import projectGetterReducer from './getters/projectGetterReducer'
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

const Nemo = combineReducers({
  navigation: NavigationReducer,
  user: userReducer,
  projects: projectGetterReducer,
  polls: pollReducer,
  router: routerReducer,
  status: statusGetterReducer
})

export default Nemo
