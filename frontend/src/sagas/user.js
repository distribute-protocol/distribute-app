import { all, put, takeEvery } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { LOGIN_USER, REGISTER_USER } from '../constants/UserActionTypes'
import { loggedInUser } from '../actions/userActions'
import * as _ from 'lodash'
import {eth, web3, tr, rr, dt} from '../utilities/blockchain'

function * loginUser (action) {
  const credentials = action.credentials
  let accounts = eth.accounts
  let bal
  yield bal = rr.first(accounts[0])
  if (!bal) {
    yield rr.register({from: accounts[0]})
  }
  yield put(loggedInUser(credentials))
  yield put(push(`/status`))
}

// function* registerUser (credentials) {
//   // reaches here
//   let config = {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(credentials)
//   }
//   let registeredUser
//   yield fetch('/api/register', config)
//     .then((response) => response.json())
//     .then((user) => {
//       registeredUser = user
//     })
//   yield put(loggedInUser(registeredUser))
// }

function * userSaga () {
  yield all([
    takeEvery(LOGIN_USER, loginUser)
    // takeEvery(REGISTER_USER, registerUser)
  ])
}

export default userSaga
