import React from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'antd'
import Sidebar from '../components/shared/Sidebar'
import StakeProject from '../components/shared/StakeProject'
import { push } from 'react-router-redux'
import { eth, tr, rr, pl } from '../utilities/blockchain'
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
    if (_.isEmpty(this.props.user)) {
      // this.props.reroute()
    }
  }

  async stakeTokens (address, val) {
    // console.log(address, val)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.stakeTokens(address, val, {from: accounts[0]})
        // console.log('staked', val, 'tokens on', address)
      }
    })
  }

  async unstakeTokens (address, val) {
    // console.log(address, val)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.unstakeTokens(address, val, {from: accounts[0]})
      }
    })
  }

  async stakeReputation (address, val) {
    // console.log(address, val)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await rr.stakeReputation(address, val, {from: accounts[0]})
        // console.log('staked', val, 'tokens on', address)
      }
    })
  }

  async unstakeReputation (address, val) {
    // console.log(address, val)
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await rr.stakeReputation(address, val, {from: accounts[0]})
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
      return <StakeProject
        key={i}
        cost={proj.cost}
        description={proj.description}
        index={i}
        stakingEndDate={proj.stakingEndDate}
        address={proj.address}
        stakeTokens={(val) => this.stakeTokens(proj.address, val)}
        unstakeTokens={(val) => this.unstakeTokens(proj.address, val)}
        stakeReputation={(val) => this.stakeReputation(proj.address, val)}
        unstakeReputation={(val) => this.unstakeReputation(proj.address, val)}
      />
    })
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200}}>
          <header className='App-header'>
            <h3>Stakeable Proposals</h3>
          </header>
          <div style={{ padding: '30px' }}>
            {projects}
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

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stake)
