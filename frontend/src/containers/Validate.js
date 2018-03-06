import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {eth, web3, tr, rr, pr, dt, P, pl} from '../utilities/blockchain'
import * as _ from 'lodash'

class Validate extends React.Component {
  componentWillReceiveProps (np) {
    let projectsArr

    function projectState (address) {
      return new Promise(async (resolve, reject) => {
        let proj = P.at(address)
        let state = await proj.state()
        // console.log('proj is staked', isStaked)
        resolve(state)
      })
    }

    let projects = Object.keys(np.projects).map((projAddr, i) => {
      // console.log('projAddr', projAddr)
      return projectState(projAddr)
        .then(state => {
          // console.log('state', state)
          window.state = state
          if (state.toNumber() === 4 || state.toNumber() === 2) {
            // return JSON.stringify(project)
            return np.projects[projAddr]
          }
        })
    })

    Promise.all(projects)
      .then(results => {
        // console.log(results)
        // Handle results
        // console.log('results', results)
        projectsArr = _.compact(results)
        console.log(projectsArr)
        this.setState({projects: projectsArr})
        // console.log(this.state.projects)
        // console.log('projectsArr', projectsArr)
        // console.log('state', this.state.projects)
      })
      .catch(e => {
        console.error(e)
      })
  }

  render () {
    return (
      <div style={{backgroundColor: 'purple', marginLeft: 200, width: 400, height: 600}} />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: state.projects.allProjects,
  }
}

export default connect(mapStateToProps)(Validate)
