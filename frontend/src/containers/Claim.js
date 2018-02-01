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
    this.hashListForSubmission = this.hashListForSubmission.bind(this)
    this.hashTasksForAddition = this.hashTasksForAddition.bind(this)

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

  addTaskHash (projectAddress, val) {
    console.log('taskHash', projectAddress, val)
    let hashedVal = this.hashTasksForAddition(val)
    console.log('hashedVal', hashedVal)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        console.log(accounts)
        await pr.addTaskHash(projectAddress, hashedVal, {from: accounts[0]})
      }
    })
  }

  hashTasksForAddition (data) {
    let hashList = this.hashListForSubmission(data)
    hashList.map(arr => arr.slice(2))
    let numArgs = hashList.length
    let args = 'bytes32'.concat(' bytes32'.repeat(numArgs - 1)).split(' ')
    let taskHash = hashing.keccakHashes(args, hashList)
    // console.log('0x' + taskHash)
    return '0x' + taskHash
  }

  hashListForSubmission (data) {
    let tasks = data.split(',')     // split tasks up
    console.log(tasks)
    let taskHashArray = []
    let args = ['string']     // CHANGE THIS WHEN ACTUALLY FORMATTING DATA CORRECTLY
    // let args = ['bytes32', 'bytes32', 'bytes32']
    for (var i = 0; i < tasks.length; i++) {
      let thisTask = tasks[i].split(';')  // split each task into elements
      console.log(thisTask)
      taskHashArray.push('0x' + hashing.keccakHashes(args, thisTask))
    }
    console.log(taskHashArray)
    return taskHashArray
  }

  render () {
    const projects = this.state.projects.map((proj, i) => {
      return <Col span={8} key={i}>
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
        </header>
        <div style={{ padding: '30px' }}>
          <Row gutter={16}>
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
