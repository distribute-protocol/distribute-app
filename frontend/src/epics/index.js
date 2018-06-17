import { getProposedProjectsEpic } from './project'
import { getNetworkStatusEpic } from './network'
import { getUserStatusEpic } from './user'

import { combineEpics } from 'redux-observable'

export default combineEpics(getNetworkStatusEpic, getUserStatusEpic, getProposedProjectsEpic)
