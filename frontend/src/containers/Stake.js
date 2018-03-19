import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import Project from './project/Stake'
import { push } from 'react-router-redux'
import { eth, tr, rr, pl, pr, P } from '../utilities/blockchain'
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
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.stakeTokens(address, val, {from: accounts[0]})
      }
    })
  }

  async unstakeTokens (address, val) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await tr.unstakeTokens(address, val, {from: accounts[0]})
      }
    })
  }

  async stakeReputation (address, val) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await rr.stakeReputation(address, val, {from: accounts[0]})
      }
    })
  }

  async unstakeReputation (address, val) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await rr.stakeReputation(address, val, {from: accounts[0]})
      }
    })
  }

  async checkStaked (address) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.checkStaked(address, {from: accounts[0]})
      }
    })
  }

  componentWillReceiveProps (np) {
    let projectsArr

    function projectState (address) {
      return new Promise(async (resolve, reject) => {
        let state = await P.at(address).state()
        resolve(state)
      })
    }

    let projects = Object.keys(np.projects).map((projAddr, i) => {
      return projectState(projAddr)
        .then(state => {
          if (state.toNumber() === 1) {
            console.log(state.toNumber())
            return np.projects[projAddr]
          }
        })
    })

    Promise.all(projects)
      .then(results => {
        projectsArr = _.compact(results)
        this.setState({projects: projectsArr})
      })
      .catch(e => {
        console.error(e)
      })
  }

  render () {
    const projects = this.state.projects.map((proj, i) => {
      return <Project
        key={i}
        index={i}
        address={proj.address}
        stakeTokens={(val) => this.stakeTokens(proj.address, val)}
        unstakeTokens={(val) => this.unstakeTokens(proj.address, val)}
        stakeReputation={(val) => this.stakeReputation(proj.address, val)}
        unstakeReputation={(val) => this.unstakeReputation(proj.address, val)}
        checkStaked={() => this.checkStaked(proj.address)}
      />
    })
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200}}>
          <header className='App-header'>
            <h3>Stakeable Proposals</h3>
          </header>
          <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
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
