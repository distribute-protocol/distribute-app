import React from 'react'
import Sidebar from '../../components/shared/Sidebar'
import Project from '../project/Finished'
import { connect } from 'react-redux'
import { eth } from '../../utilities/blockchain'
import { getProjects } from '../../actions/projectActions'
import { getUserVotes } from '../../actions/userActions'

import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 7){
      address,
      id,
      ipfsHash,
      location,
      name,
      tasks {
        id,
        address,
        claimer {
          account
        },
        claimed,
        claimedAt,
        complete,
        description,
        index,
        hash,
        weighting,
        validationRewardClaimable,
        workerRewardClaimable,
        workerRewarded
      }
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

class Failed extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
  }

  componentWillMount () {
    this.getProjects()
    this.getVotes()
  }

  async getProjects () {
    eth.getAccounts(async (err, result) => {
      if (!err) {
        if (result.length) {
          this.props.getProjects()
          this.setState({user: result[0]})
        } else {
          console.log('Please Unlock MetaMask')
        }
      }
    })
  }

  getVotes () {
    eth.getAccounts(async (err, result) => {
      if (!err) {
        if (result.length) {
          this.props.getUserVotes(result[0])
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
          user={this.state.user}
          project={this.props.projects[address]}
          state={7}
        />
      })
      : []
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Failed Projects</h3>
          </header>
          <div style={{paddingLeft: '30px', paddingRight: '30px'}}>
            {projects}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: state.projects[7]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProjects: () => dispatch(getProjects(7, projQuery)),
    getUserVotes: (account) => dispatch(getUserVotes(account))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Failed)
