import React, { Component } from 'react'
import { connect } from 'react-redux'
import {eth, web3, tr, rr, dt, P} from '../utilities/blockchain'
import * as _ from 'lodash'

class Claim extends Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    window.state = this.state
  }

  componentWillReceiveProps (np) {
    console.log('hey')
    let projectsArr

    function projectState (address) {
      return new Promise(async (resolve, reject) => {
        let proj = P.at(address)
        let isStaked = await proj.isStaked()
        // console.log(proj)
        resolve(isStaked)
        // proj.isStaked((error, response) => {
        //   if (!error) {
        //     resolve(response)
        //   } else {
        //     reject(response)
        //   }
        // })
      })
    }
    // console.log(np.projects)
    let projects = np.projects.map((project, i) => {
      console.log(project)
      return projectState(project.address)
        .then(state => {
          console.log(state)
          if (state) {
            // return JSON.stringify(project)
            return <div key={i}>
              <div>Address: {project.address}</div>
              <div>Cost: {project.cost} ETH</div>
              <div>Description: {project.description}</div>
              <div>Staking End Period: {project.stakingEndDate}</div>
            </div>
          }
        })
    })

    Promise.all(projects)
      .then(results => {
        // Handle results
        projectsArr = _.compact(results)
        this.setState({projects: projectsArr})
      })
      .catch(e => {
        console.error(e)
      })
  }

  render () {
    return (
      <div style={{marginLeft: 200, width: 400, height: 600}}>
        <pre>{this.state.projects}</pre>
      </div>
    )
  }
}

// let proj = P.at(project.address)
// let returnProj
// await proj.isStaked((err, val) => {
//   if (!err) {
//     // console.log(val)
//     if (val) {
//       console.log('hey')
//       return <div>{project}</div>
//     }
//   }
// })
// return returnProj
const mapStateToProps = (state) => {
  return {
    projects: state.projects.projects
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     proposeProject: (projectDetails) => dispatch(proposeProject(projectDetails))
//   }
// }

export default connect(mapStateToProps)(Claim)
