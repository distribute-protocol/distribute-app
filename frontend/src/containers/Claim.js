import React from 'react'
import { connect } from 'react-redux'
import { Col, Row, Button } from 'antd'
import Sidebar from './Sidebar'
import { push } from 'react-router-redux'
import { P } from '../utilities/blockchain'
import ClaimProject from '../components/shared/ClaimProject'
import fastforward from '../utilities/fastforward'
import * as _ from 'lodash'

class Claim extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    this.fastForward = this.fastForward.bind(this)
  }

  componentWillMount () {
    if (_.isEmpty(this.props.user)) {
      // this.props.reroute()
    }
  }

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
          if (state.toNumber() === 3) {
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
        // console.log(projectsArr)
        this.setState({projects: projectsArr})
        // console.log(this.state.projects)
        // console.log('projectsArr', projectsArr)
        // console.log('state', this.state.projects)
      })
      .catch(e => {
        console.error(e)
      })
  }

// fast forward Ganache 1 week
  async fastForward () {
    await fastforward(2 * 7 * 24 * 60 * 60)
    // console.log('fastForward')
  }

  render () {
    const projects = this.state.projects.map((proj, i) => {
      return <Col span={25} key={i}>
        <ClaimProject
          key={i}
          cost={proj.cost}
          description={proj.description}
          index={i}
          // taskHashEndDate={proj.taskHashEndDate}
          address={proj.address}
        />
      </Col>
    })
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200}}>
          <header className='App-header'>
            {/* <img src={logoclassName='App-logo' alt='logo' /> */}
            {/* <h1 className='App-title2'>distribute</h1> */}
            <h3>Claim Tasks from Active Projects</h3>

            <Button type='danger' onClick={this.fastForward}>fast forward 2 weeks</Button>
            <h6>ONLY DO THIS IF YOU ARE READY TO MOVE EVERY PROJECT TO THE NEXT STATE</h6>
            <h6>IF A PROJECT HAS UNCLAIMED TASKS IT WILL FAIL AND YOU WILL LOSE YOUR STAKED TOKENS</h6>
          </header>
          <div style={{ padding: '30px' }}>
            <Row gutter={12}>
              {projects}
            </Row>
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
    projects: state.projects.allProjects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Claim)
