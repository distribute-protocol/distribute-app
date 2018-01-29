import React from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'antd'
import {eth, web3, tr, rr, dt, P} from '../utilities/blockchain'
import ClaimProject from '../components/shared/ClaimProject'
import * as _ from 'lodash'

class Claim extends React.Component {
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
        // console.log('proj in projectState', proj)
        resolve(isStaked)
      })
    }

    let projects = np.projects.projects.map((project, i) => {
      // console.log(project)
      return projectState(project.address)
        .then(state => {
          // console.log('state', state)
          if (state) {
            // return JSON.stringify(project)
            return project
          }
        })
    })

    Promise.all(projects)
      .then(results => {
        // Handle results
        projectsArr = _.compact(results)
        this.setState({projects: projectsArr})
        console.log(projectsArr)
        // console.log(this.state.projects)
      })
      .catch(e => {
        console.error(e)
      })
  }

  addTaskHash (projectAddress, val) {
    console.log('taskHash', projectAddress, val)
  }

  render () {
    const projects = this.state.projects.map((proj, i) => {
      return <Col span={8}>
        <ClaimProject
          key={i}
          cost={proj.cost}
          description={proj.description}
          index={i}
          taskHashEndDate={proj.taskHashEndDate}
          address={proj.address}
          addTask={(val) => this.addTaskHash(proj.address, val)}
        />
      </Col>
    })
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          {/* <img src={logoclassName='App-logo' alt='logo' /> */}
          <h1 className='App-title'>distribute</h1>
        </header>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{marginLeft: 20, marginTop: 40}}>
            <h3>Open Proposals</h3>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <Row type='flex' justify='space-around'>
                {projects}
              </Row>
              {/* <CardColumns> */}
              {/* {projects} */}
              {/* </CardColumns> */}
            </div>
          </div>
        </div>
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
    projects: state.projects
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     proposeProject: (projectDetails) => dispatch(proposeProject(projectDetails))
//   }
// }

export default connect(mapStateToProps)(Claim)
