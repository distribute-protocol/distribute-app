import NavigationReducer from './NavigationReducer'
import userReducer from './userReducer'
import projectReducer from './projectReducer'
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

const Nemo = combineReducers({
  navigation: NavigationReducer,
  user: userReducer,
  projects: projectReducer,
  router: routerReducer
})

export default Nemo
