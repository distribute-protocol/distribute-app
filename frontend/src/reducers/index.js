import NavigationReducer from './NavigationReducer'
import userReducer from './userReducer'
import pollReducer from './pollReducer'
import networkReducer from './networkReducer'
import projectReducer from './projectReducer'
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

const Nemo = combineReducers({
  navigation: NavigationReducer,
  user: userReducer,
  projects: projectReducer,
  polls: pollReducer,
  router: routerReducer,
  network: networkReducer
})

export default Nemo
