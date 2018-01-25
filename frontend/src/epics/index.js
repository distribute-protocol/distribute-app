import { combineEpics } from 'redux-observable'
import 'rxjs'
// import { projectStateEpic } from './project'
const GET_PROJECT_STATE = 'GET_PROJECT_STATE'
const projectStateEpic = action$ =>
  action$.ofType(GET_PROJECT_STATE)
  .delay(2000) // Asynchronously wait 1000ms then continue
  .mapTo({ type: 'PROJECT_STATE_RECEIVED' })
export default combineEpics(projectStateEpic)
