import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import Project from './project/1ProjectStake'
import { push } from 'react-router-redux'
import { eth, dt } from '../utilities/blockchain'
import { getProjects, stakeProject, unstakeProject, checkStakedStatus } from '../actions/projectActions'
import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 1){
      address,
      id,
      ipfsHash,
      location {
        lat,
        lng
      },
      name
      nextDeadline,
      photo,
      reputationBalance,
      reputationCost,
      summary,
      tokenBalance,
      weiBal,
      weiCost
    }
  }`

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
    this.stakeProject = this.stakeProject.bind(this)
    this.unstakeProject = this.unstakeProject.bind(this)
    this.checkStakedStatus = this.checkStakedStatus.bind(this)
  }

  componentWillMount () {
    this.getProjects()
  }

  async getProjects () {
    eth.getAccounts(async (err, result) => {
      if (!err) {
        if (result.length) {
          let currentPrice = (await dt.currentPrice()).toNumber()
          this.props.getProjects()
          this.setState({currentPrice})
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
      ? Object.keys(this.props.projects).map((address, i) => {
        return <Project
          key={i}
          index={i}
          address={address}
          currentPrice={this.state.currentPrice}
          project={this.props.projects[address]}
          stakeProject={(type, val) => this.stakeProject(type, address, val)}
          unstakeProject={(type, val) => this.unstakeProject(type, address, val)}
          checkStaked={() => this.checkStakedStatus(address)}
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
    projects: state.projects[1]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/')),
    getProjects: () => dispatch(getProjects(1, projQuery)),
    stakeProject: (collateralType, projectAddress, value, txObj) => dispatch(stakeProject(collateralType, projectAddress, value, txObj)),
    unstakeProject: (collateralType, projectAddress, value, txObj) => dispatch(unstakeProject(collateralType, projectAddress, value, txObj)),
    checkStakedStatus: (projectAddress, txObj) => dispatch(checkStakedStatus(projectAddress, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stake)
