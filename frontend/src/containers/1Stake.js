import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import Project from './project/1Stake'
import { push } from 'react-router-redux'
import { eth, dt } from '../utilities/blockchain'
import { getProjects } from '../actions/projectActions'
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
          this.setState({currentPrice, user: result[0]})
        } else {
          console.log('Please Unlock MetaMask')
        }
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
          user={this.state.user}
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
    getProjects: () => dispatch(getProjects(1, projQuery))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stake)
