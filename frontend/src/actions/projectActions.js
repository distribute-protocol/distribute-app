import { PROPOSE_PROJECT } from '../constants/ProjectActionTypes'

export function proposeProject (projectDetails) {
  return {
    type: PROPOSE_PROJECT,
    projectDetails
  }
}
