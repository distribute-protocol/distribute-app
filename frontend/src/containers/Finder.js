import React from 'react'
import { connect } from 'react-redux'
import MiniSidebar from '../components/shared/MiniSidebar'
import TitleBar from '../components/shared/TitleBar'
import SearchProjectBar from '../components/shared/SearchProjectBar'
import ProjectCardGrid from '../components/shared/ProjectCardGrid'
import { getUserStatusWallet } from '../actions/userActions'
import { getProjects } from '../actions/projectActions'
import { eth } from '../utilities/blockchain'
import { gradient2, lightgradient2 } from '../styles/colors'
import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 1){
      address,
      id,
      ipfsHash,
      location,
      name
      nextDeadline,
      photo,
      reputationBalance,
      reputationCost,
      nextDeadline,
      summary,
      tokenBalance,
      weiBal,
      weiCost
    }
  }`

class Finder extends React.Component {
  constructor () {
    super()
    this.state = {
      firstTime: true,
      role: 'Finder',
      showSidebarIcons: true
    }
    this.redirect = this.redirect.bind(this)
  }

  componentWillMount () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.getUserStatusWallet(accounts[0])
          this.props.getProjects()
        }
      }
    })
  }

  redirect (url) {
    this.props.history.push(url)
  }

  render () {
    return (
      <div style={{ backgroundColor: lightgradient2, height: '100vh' }}>
        <MiniSidebar showIcons={this.state.showSidebarIcons} highlightIcon={this.state.role} redirect={this.redirect} />
        <TitleBar role={this.state.role} />
        <SearchProjectBar />
        <ProjectCardGrid projectData={this.props.projects['1']} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
    // user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserStatusWallet: (userAccount) => dispatch(getUserStatusWallet(userAccount)),
    getProjects: () => dispatch(getProjects(1, projQuery))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Finder)
