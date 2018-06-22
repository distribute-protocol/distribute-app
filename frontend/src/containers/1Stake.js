import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import Project from './project/1ProjectStake'
import { push } from 'react-router-redux'
import { eth } from '../utilities/blockchain'
import { getProposedProjects, stakeProject, unstakeProject, checkStakedStatus } from '../actions/projectActions'

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
    this.stakeProject = this.stakeProject.bind(this)
    this.unstakeProject = this.unstakeProject.bind(this)
    this.checkStakedStatus = this.checkStakedStatus.bind(this)
  }

  componentWillMount () {
    eth.getAccounts((err, result) => {
      if (!err) {
        if (result.length) {
          this.props.getProposedProjects()
        } else {
          console.log('Please Unlock MetaMask')
        }
      }
    })
  }

  stakeProject (type, address, val) {
    eth.getAccounts((err, accounts) => {
      if (!err) {
        this.props.stakeProject(type, address, val, {from: accounts[0]})
      }
    })
  }

  unstakeProject (type, address, val) {
    eth.getAccounts((err, accounts) => {
      if (!err) {
        this.props.unstakeProject(type, address, val, {from: accounts[0]})
      }
    })
  }

  checkStakedStatus (address) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.props.checkStakedStatus(address, {from: accounts[0]})
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
          stakeProject={(type, val) => this.stakeProject(type, proj.address, val)}
          unstakeProject={(type, val) => this.unstakeProject(type, proj.address, val)}
          checkStaked={() => this.checkStakedStatus(proj.address)}
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
    getProposedProjects: () => dispatch(getProposedProjects()),
    stakeProject: (collateralType, projectAddress, value, txObj) => dispatch(stakeProject(collateralType, projectAddress, value, txObj)),
    unstakeProject: (collateralType, projectAddress, value, txObj) => dispatch(unstakeProject(collateralType, projectAddress, value, txObj)),
    checkStakedStatus: (projectAddress, txObj) => dispatch(checkStakedStatus(projectAddress, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stake)
