import React from 'react'
import { Button } from 'antd'
import { push } from 'react-router-redux'
import Sidebar from '../../components/shared/Sidebar'
import Project from '../project/Finished'
import fastforward from '../../utilities/fastforward'
import { connect } from 'react-redux'
import { eth, pr } from '../../utilities/blockchain'
import { getProjects } from '../../actions/projectActions'

import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 6){
      address,
      id,
      ipfsHash,
      location {
        lat,
        lng
      },
      name,
      # tasks {
      #   id,
      #   address,
      #   claimer {
      #     account
      #   },
      #   claimed,
      #   claimedAt,
      #   complete,
      #   description,
      #   index,
      #   hash,
      #   weighting,
      #   validationRewardClaimable,
      #   workerRewardClaimable,
      #   workerRewarded
      # }
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

class Vote extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    // this.fastForward = this.fastForward.bind(this)
    // this.rewardValidator = this.rewardValidator.bind(this)
    // this.getVotes = this.getVotes.bind(this)
    // this.rewardTask = this.rewardTask.bind(this)
    // this.voteCommit = this.voteCommit.bind(this)
    // this.voteReveal = this.voteReveal.bind(this)
    // this.voteRescue = this.voteRescue.bind(this)
  }

  componentWillMount () {
    this.getProjects()
  }

  async getProjects () {
    eth.getAccounts(async (err, result) => {
      if (!err) {
        if (result.length) {
          this.props.getProjects()
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
          project={this.props.projects[address]}
        />
      })
      : []
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Completed Projects</h3>
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
    projects: state.projects[6]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/')),
    getProjects: () => dispatch(getProjects(6, projQuery))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vote)
