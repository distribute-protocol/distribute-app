import React from 'react'
import { Button } from 'antd'
import Sidebar from '../components/shared/Sidebar'
import Project from './project/5Vote'
import fastforward from '../utilities/fastforward'
import { connect } from 'react-redux'
import { eth } from '../utilities/blockchain'
import { getProjects } from '../actions/projectActions'
import { commitVote, revealVote, rescueVote } from '../actions/taskActions'
import { getUserVotes } from '../actions/userActions'

import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 5){
      address,
      id,
      ipfsHash,
      location {
        lat,
        lng
      },
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

class Vote extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    this.fastForward = this.fastForward.bind(this)
    this.getVotes = this.getVotes.bind(this)
    this.voteCommit = this.voteCommit.bind(this)
    this.voteReveal = this.voteReveal.bind(this)
    this.voteRescue = this.voteRescue.bind(this)
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

  async fastForward () {
    await fastforward(7 * 24 * 60 * 60)
  }

  async voteCommit (type, projAddress, taskIndex, value, secretHash, status, salt, pollID) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        // Need to use doubly linked list on the server to find the proper poll position
        // let prevPollID = this.getPrevPollID(value, accounts[0])
        await this.props.voteCommit(type, projAddress, taskIndex, value, secretHash, status.toString(), salt, pollID, {from: accounts[0]})
      }
    })
  }

  async voteReveal (type, projectAddress, taskIndex, status, salt) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await this.props.voteReveal(type, projectAddress, taskIndex, status, salt, {from: accounts[0]})
      }
    })
  }

  async voteRescue (type, projectAddress, taskIndex) {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await this.props.voteRescue(type, projectAddress, taskIndex, {from: accounts[0]})
      }
    })
  }

  getPrevPollID (numTokens, user) {
    let pollInfo = this.props.users[user] // get object of poll data w/pollID's as keys
    if (typeof pollInfo === 'undefined') return 0
    let keys = Object.keys(pollInfo)
    let currPollID = 0
    let currNumTokens = 0
    // iterate through all poll info
    for (let i = 0; i < keys.length; i++) {
      // if pollInfo at index has less than or equal tokens to the number of tokens being inserted and the curr poss num tokens is greater than currHolder than inser
      if ((pollInfo[keys[i]].numTokens <= numTokens) && (pollInfo[keys[i]].numTokens > currNumTokens)) {
        currNumTokens = pollInfo[keys[i]].numTokens
        currPollID = keys[i]
      }
    }
    return currPollID
  }

  render () {
    const projects = typeof this.props.projects !== `undefined`
      ? Object.keys(this.props.projects).map((address, i) => {
        return <Project
          key={i}
          index={i}
          address={address}
          project={this.props.projects[address]}
          validations={(address) => this.getValidations(address)}
          voteCommit={this.voteCommit}
          voteReveal={this.voteReveal}
          voteRescue={this.voteRescue}
          user={this.state.user}
        />
      })
      : []
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Vote Tasks</h3>
            <Button type='danger' onClick={this.fastForward}>fast forward 1 week</Button>
            <h6>ONLY DO THIS IF YOU ARE READY TO MOVE EVERY PROJECT TO THE NEXT STATE</h6>
            <h6>IF A PROJECT HAS UNCLAIMED TASKS IT WILL FAIL AND YOU WILL LOSE YOUR STAKED TOKENS</h6>
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
    projects: state.projects[5],
    pollID: state.polls.pollID
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProjects: () => dispatch(getProjects(5, projQuery)),
    voteCommit: (collateralType, projectAddress, taskIndex, value, secretHash, vote, salt, pollID, txObj) => {
      return dispatch(commitVote(collateralType, projectAddress, taskIndex, value, secretHash, vote, salt, pollID, txObj))
    },
    voteReveal: (collateralType, projectAddress, taskIndex, vote, salt, txObj) => {
      return dispatch(revealVote(collateralType, projectAddress, taskIndex, vote, salt, txObj))
    },
    voteRescue: (collateralType, projectAddress, taskIndex, txObj) => {
      return dispatch(rescueVote(collateralType, projectAddress, taskIndex, txObj))
    },
    getUserVotes: (account) => dispatch(getUserVotes(account))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vote)
