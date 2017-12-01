import { compose, createStore, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'
import { routerMiddleware } from 'react-router-redux'
import { autoRehydrate, persistStore } from 'redux-persist'

import reducers from '../reducers'
// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const routeMiddleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
function configureStore () {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    reducers,
    compose(
      applyMiddleware(routeMiddleware, sagaMiddleware),
      autoRehydrate()
    )
  )
  sagaMiddleware.run(rootSaga)
  return store
}

const store = configureStore()
persistStore(store)
export default store
