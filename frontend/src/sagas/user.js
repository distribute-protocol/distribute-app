/* global fetch Headers */

import { all, put, takeEvery } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { LOGIN_USER } from '../constants/UserActionTypes'
import { loggedInUser } from '../actions/userActions'
import * as _ from 'lodash'
import { web3, rr } from '../utilities/blockchain'

function * loginUser (action) {
  console.log('login user!')
  const credentials = action.credentials
  let config = {
    method: 'GET',
    headers: new Headers(),
    mode: 'cors',
    cache: 'default'
  }
  let userObj = {}
  let account = web3.eth.accounts[0]
  // call database to see if user is already stored
  yield fetch(`/api/user?account=${account}`, config)
    .then((response) => response.json())
    .then((user) => {
      userObj = user
    })
  yield (_.isEmpty(userObj) || userObj.reputationBalance === 0)
    // user is not already registered or stored in the database -> do that here!
    ? registerUser(credentials, account)
    // dispatch loggedInUser action
    : put(loggedInUser(userObj))
  yield put(push(`/status`))
}

function * registerUser (credentials, account) {
  // if user is not yet registered, do that now
  let config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }
  let val = yield rr.first(account)
  if (!val) {
    console.log('register user')
    yield fetch(`/api/user?account=${account}`, config)
    yield rr.register({from: account})
  }
}

function * userSaga () {
  yield all([
    takeEvery(LOGIN_USER, loginUser)
  ])
}

export default userSaga
