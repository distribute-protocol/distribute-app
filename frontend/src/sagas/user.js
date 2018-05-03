/* global fetch Headers */

import { all, put, takeEvery } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { LOGIN_USER } from '../constants/UserActionTypes'
import { loggedInUser } from '../actions/userActions'
import * as _ from 'lodash'
import { eth, rr } from '../utilities/blockchain'

function * loginUser (action) {
  const credentials = action.credentials
  let accounts = eth.accounts
  // if user is not yet registered, do that now
  yield rr.first(accounts[0]).then(val => {
    if (!val) {
      rr.register({from: accounts[0]})
    }
  })
  let config = {
    method: 'GET',
    headers: new Headers(),
    mode: 'cors',
    cache: 'default'
  }
  let userObj = {}
  // call database to see if user is already stored
  yield fetch(`/api/login?address=${credentials.address}&pubkey=${credentials.publicKey}`, config)
    .then((response) => response.json())
    .then((user) => {
      userObj = user
      console.log('userObj', userObj)
    })
  yield _.isEmpty(userObj)
    // user is not already stored in the database -> store them!
    ? registerUser(credentials)
    // dispatch loggedInUser action
    : put(loggedInUser(userObj))
  yield put(push(`/status`))
}

function * registerUser (credentials) {
  let config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }
  let registeredUser
  yield fetch('/api/register', config)
    .then((response) => response.json())
    .then((user) => {
      registeredUser = user
    })
  yield put(loggedInUser(registeredUser))
}

function * userSaga () {
  yield all([
    takeEvery(LOGIN_USER, loginUser)
  ])
}

export default userSaga
