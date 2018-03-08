import { all } from 'redux-saga/effects'
import userSaga from './user'
// import profileSaga from './profiles'
export default function* rootSaga () {
  yield all([
    // profileSaga(),
    userSaga()
  ])
}
