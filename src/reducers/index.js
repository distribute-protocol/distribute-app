import NavigationReducer from './NavigationReducer'
import userReducer from './userReducer'
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

const Nemo = combineReducers({
  navigation: NavigationReducer,
  user: userReducer,
  router: routerReducer
})

export default Nemo
