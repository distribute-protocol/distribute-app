import React from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'antd'
import StakeProject from '../components/shared/StakeProject'
import { eth, web3, tr, dt, P } from '../utilities/blockchain'
import * as _ from 'lodash'

class Stake extends React.Component {
  constructor () {
    super()
    this.state = {
      value: 0,
      description: '',
      projects: [],
      tempProject: {},
      currPrice: 0
    }

    window.projects = this.state.projects
  }

  componentWillMount () {
    // this.getProjects()
    // dt.currentPrice((err, val) => {
    //   if (!err) {
    //     this.setState({currPrice: val.toNumber()})
    //   }
    // })
  }

  async stakeProject (address, val) {
    console.log(address, val)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.stakeTokens(address, val, {from: accounts[0]})
        console.log('staked', val, 'tokens on', address)
      }
    })
  }

  async unstakeProject (address, val) {
    console.log(address, val)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.unstakeTokens(address, val, {from: accounts[0]})
      }
    })
  }
  componentWillReceiveProps (np) {
    let projectsArr

    function projectState (address) {
      return new Promise(async (resolve, reject) => {
        let proj = P.at(address)
        let isStaked = await proj.isStaked()
        console.log('proj in projectState', proj)
        resolve(isStaked)
      })
    }

    let projects = np.projects.projects.map((project, i) => {
      // console.log(project)
      return projectState(project.address)
        .then(state => {
          if (!state) {
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
      })
      .catch(e => {
        console.error(e)
      })
  }

  render () {
    const projects = this.state.projects.map((proj, i) => {
      return <Col span={8} key={i}>
        <StakeProject
          key={i}
          cost={proj.cost}
          description={proj.description}
          index={i}
          stakingEndDate={proj.stakingEndDate}
          address={proj.address}
          stakeProject={(val) => this.stakeProject(proj.address, val)}
          unstakeProject={(val) => this.unstakeProject(proj.address, val)}
        />
      </Col>
    })
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          <h3>Stakeable Proposals</h3>
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

export default connect(mapStateToProps)(Stake)
