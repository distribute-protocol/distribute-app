/* global fetch Headers */

import { all, put, takeEvery } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { LOGIN_USER } from '../constants/UserActionTypes'
import { loggedInUser } from '../actions/userActions'
import * as _ from 'lodash'
import { web3, ethjs, rr } from '../utilities/blockchain'

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
  yield fetch(`/api/users?account=${account}`, config)
    .then((response) => response.json())
    .then((user) => {
      userObj = user
    })
  yield _.isEmpty(userObj)
    // user is not already registered or stored in the database -> do that here!
    ? registerUser(credentials)
    // dispatch loggedInUser action
    : put(loggedInUser(userObj))
  yield put(push(`/status`))
}

function * registerUser (credentials) {
  console.log('register user!')
  // if user is not yet registered, do that now
  yield ethjs.accounts().then(accounts => {
    // console.log(accounts)
    rr.first(accounts[0]).then(val => {
      if (!val) {
        rr.register({from: accounts[0]})
      }
    })
  })
}

function * userSaga () {
  yield all([
    takeEvery(LOGIN_USER, loginUser)
  ])
}

export default userSaga
