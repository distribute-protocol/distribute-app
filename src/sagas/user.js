import { all, put, takeEvery } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { LOGIN_USER, REGISTER_USER } from '../constants/UserActionTypes'
import { loggedInUser } from '../actions/userActions'
import * as _ from 'lodash'

function* loginUser (action) {
  const credentials = action.credentials
  let config = {
    method: 'GET',
    headers: new Headers(),
    mode: 'cors',
    cache: 'default'
  }
  let userObj = {}
  yield fetch(`/api/login?address=${credentials.address}&pubkey=${credentials.publicKey}`, config)
    .then((response) => response.json())
    .then((user) => {
      userObj = user
      // console.log('userObj', userObj)
    })
  yield _.isEmpty(userObj)
      ? registerUser(credentials)
      : put(loggedInUser(userObj))
  yield put(push(`/profiles/${credentials.address}`))
}

function* registerUser (credentials) {
  // reaches here
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

function* userSaga () {
  yield all([
    takeEvery(LOGIN_USER, loginUser),
    takeEvery(REGISTER_USER, registerUser)
  ])
}

export default userSaga
