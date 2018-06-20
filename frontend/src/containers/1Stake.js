import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import Project from './project/1Stake'
import { push } from 'react-router-redux'
import { eth, dt, tr, rr, pr, P } from '../utilities/blockchain'
import * as _ from 'lodash'
import { getProposedProjects } from '../actions/projectActions'

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
    this.getProposedProjects = this.getProposedProjects.bind(this)
    // window.projects = this.state.projects
    // window.pl = pl
  }

  componentWillMount () {
    this.getProposedProjects()
  }

  async getProposedProjects () {
    let accounts
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        if (accounts.length) {
          let currentPrice = (await dt.currentPrice()).toNumber()
          this.props.getProposedProjects(currentPrice)
          this.setState({currentPrice})
          console.log(currentPrice)
        }
      }
    })
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
      // console.log(address, accounts[0])
      if (!err) {
        await pr.checkStaked(address, {from: accounts[0]})
      }
    })
  }

  render () {
    const projects = typeof this.props.projects !== `undefined`
      ? this.props.projects.map((proj, i) => {
        return <Project
          key={i}
          index={i}
          address={proj.address}
          currentPrice={this.state.currentPrice}
          project={proj}
          stakeTokens={(val) => this.stakeTokens(proj.address, val)}
          unstakeTokens={(val) => this.unstakeTokens(proj.address, val)}
          stakeReputation={(val) => this.stakeReputation(proj.address, val)}
          unstakeReputation={(val) => this.unstakeReputation(proj.address, val)}
          checkStaked={() => this.checkStaked(proj.address)}
          getProjectStatus={() => this.getProjectStatus(proj.address)}
        />
      })
      : []
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
    projects: state.projects.proposedProjects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/')),
    getProposedProjects: () => dispatch(getProposedProjects())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stake)
