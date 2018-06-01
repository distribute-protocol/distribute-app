// /* global Headers fetch */
//
// import { GET_TOTAL_TOKENS, GET_USER_TOKENS, GET_TOTAL_REPUTATION, GET_USER_REPUTATION } from '../constants/getters/StatusGetterActionTypes'
// import { totalTokensReceived, userTokensReceived, totalReputationReceived, userReputationReceived } from '../actions/getters/statusGetterActions'
//
// // import 'rxjs'
// import { combineEpics } from 'redux-observable'
// import Rx from 'rxjs/Rx'
// const { Observable } = Rx
//
// // import { projectStateEpic } from './project'
//
// let getConfig = {
//   method: 'GET',
//   headers: new Headers(),
//   mode: 'cors',
//   cache: 'default'
// }
//
// export async function fetchService (url) {
//   let response = await fetch(url, getConfig)
//   return response.json()
// }
//
// const getTotalTokensEpic = action$ =>
//   action$.ofType(GET_TOTAL_TOKENS)
//   // pull value from database
//     .mergeMap(action => Observable.from(fetchService(`/api/totaltokens`))
//       .map(res => Observable.of(res))
//       .map(result => totalTokensReceived(result))
//     )
//
// const getUserTokensEpic = action$ =>
//   action$.ofType(GET_USER_TOKENS)
//   // pull value from database
//     .mergeMap(({payload}) => Observable.from(fetchService(`/api/userbalance?account=`, payload))
//       .map(res => Observable.of(res))
//       .map(result => userTokensReceived(result))
//     )
//
// const getTotalReputationEpic = action$ =>
//   // action$.ofType(GET_TOTAL_REPUTATION)
//   // // pull value from database
//   //   .mergeMap(action => Observable.from(fetchService(`/api/totalreputation`))
//   //     .map(res => Observable.of(res))
//   //     .map(result => totalReputationReceived(result))
//   //   )
//
// const getUserReputationEpic = action$ =>
//   // action$.ofType(GET_USER_REPUTATION)
//   // // pull value from database
//   //   .mergeMap(({payload}) => Observable.from(fetchService(`/api/userreputation?account=`, payload))
//   //     .map(res => Observable.of(res))
//   //     .map(result => userReputationReceived(result))
//   //   )
//
// export default combineEpics(getTotalTokensEpic, getUserTokensEpic, getTotalReputationEpic, getUserReputationEpic)
