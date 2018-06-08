import { compose, createStore, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'
import { createEpicMiddleware } from 'redux-observable'
import rootSaga from '../sagas'
import { routerMiddleware } from 'react-router-redux'
import { autoRehydrate, persistStore } from 'redux-persist'

import reducers from '../reducers'
import epics from '../epics'

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const routeMiddleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
function configureStore () {
  const epicMiddleware = createEpicMiddleware(epics)

  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    reducers,
    compose(
      applyMiddleware(routeMiddleware, sagaMiddleware, epicMiddleware),
      autoRehydrate()
    )
  )
  sagaMiddleware.run(rootSaga)
  return store
}

const store = configureStore()
let persistedStore = persistStore(store)
// persistedStore.purge()
export default store
