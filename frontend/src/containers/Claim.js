import React from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'antd'
import {eth, web3, tr, rr, pr, dt, P} from '../utilities/blockchain'
import ClaimProject from '../components/shared/ClaimProject'
import hashing from '../utilities/hashing'
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
        // console.log('projectsArr', projectsArr)
        // console.log(this.state.projects)
      })
      .catch(e => {
        console.error(e)
      })
  }

  async addTaskHash (projectAddress, val) {
    // console.log('hashedVal', val)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        // console.log(accounts)
        await pr.addTaskHash(projectAddress, val, {from: accounts[0]})
      }
    })
  }

  render () {
    const projects = this.state.projects.map((proj, i) => {
      return <Col span={25} key={i}>
        <ClaimProject
          key={i}
          cost={proj.cost}
          description={proj.description}
          index={i}
          taskHashEndDate={proj.taskHashEndDate}
          address={proj.address}
          addTaskHash={(val) => this.addTaskHash(proj.address, val)}
        />
      </Col>
    })
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          {/* <img src={logoclassName='App-logo' alt='logo' /> */}
          {/* <h1 className='App-title'>distribute</h1> */}
          <h3>Open Proposals</h3>
          <h4>separate tasks and percentages with commas</h4>
          <h4>ensure percentages correspond to tasks and add up to 100%</h4>
          <h5>e.g. install a node, install a supernode</h5>
          <h5>e.g. 20, 80</h5>
        </header>
        <div style={{ padding: '30px' }}>
          <Row gutter={12}>
            {projects}
          </Row>
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
