import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'

import store, { history } from './store/store'
import { ConnectedRouter } from 'react-router-redux'

import ApolloClient from 'apollo-boost'
export const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql'
})

ReactDOM.render(
  (<Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>),
  document.getElementById('root')
)
registerServiceWorker()
