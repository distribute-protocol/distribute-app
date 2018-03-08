import React from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'antd'
import Sidebar from './Sidebar'
import StakeProject from '../components/shared/StakeProject'
import { eth, web3, tr, dt, pl, P } from '../utilities/blockchain'
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
    window.pl = pl
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
    // console.log(address, val)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.stakeTokens(address, val, {from: accounts[0]})
        // console.log('staked', val, 'tokens on', address)
      }
    })
  }

  async unstakeProject (address, val) {
    // console.log(address, val)
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
        let isStaked = await pl.isStaked(address)
        resolve(isStaked)
      })
    }

    let projects = Object.keys(np.projects).map((projAddr, i) => {
      return projectState(projAddr)
        .then(isStaked => {
          if (!isStaked) {
            // console.log(projAddr)
            return np.projects[projAddr]
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
      // console.log(proj)
      return <Col span={10} key={i}>
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
      <div>
        <Sidebar />
        <div style={{marginLeft: 200}}>
          <header className='App-header'>
            <h3>Stakeable Proposals</h3>
          </header>
          <div style={{ padding: '30px' }}>
            <Row gutter={8}>
              {projects}
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects.allProjects
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     proposeProject: (projectDetails) => dispatch(proposeProject(projectDetails))
//   }
// }

export default connect(mapStateToProps)(Stake)
