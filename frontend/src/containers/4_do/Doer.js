import React from 'react'
import { connect } from 'react-redux'
import price from 'crypto-price'
import MiniSidebar from '../../components/shared/MiniSidebar'
import TitleBar from '../../components/shared/TitleBar'
import SearchProjectBar from '../../components/shared/SearchProjectBar'
import ProjectCardGrid from '../../components/shared/ProjectCardGrid'
import { getUserStatusWallet } from '../../actions/userActions'
import { getProjects } from '../../actions/projectActions'
import { eth } from '../../utilities/blockchain'
import { lightgradient4 } from '../../styles/colors'
import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 3){
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

class Doer extends React.Component {
  constructor () {
    super()
    this.state = {
      firstTime: true,
      role: 'Doer',
      showSidebarIcons: true,
      ethPrice: 0
    }
    this.redirect = this.redirect.bind(this)
  }

  componentWillMount () {
    let ethPrice
    eth.getAccounts((err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.getUserStatusWallet(accounts[0])
          this.props.getProjects()
          price.getCryptoPrice('USD', 'ETH').then(res => {
            if (res) {
              this.setState({ ethPrice: parseFloat(res.price) })
            }
          })
        }
      }
    })
  }

  redirect (url, state) {
    this.props.history.push(url, Object.assign({}, state, { user: this.props.user }))
  }

  render () {
    return (
      <div style={{ backgroundColor: lightgradient4, height: '100vh' }}>
        <MiniSidebar user={this.props.user} showIcons={this.state.showSidebarIcons} highlightIcon={this.state.role} redirect={this.redirect} />
        <TitleBar title={this.state.role} role={this.state.role} />
        <SearchProjectBar />
        <ProjectCardGrid nullText={<p>No projects have currently been planned.<br />Go ahead and look for a project to plan</p>}
          nullAction={'Plan'}
          projectData={this.props.projects['2']} ethPrice={this.state.ethPrice} redirect={this.redirect} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserStatusWallet: (userAccount) => dispatch(getUserStatusWallet(userAccount)),
    getProjects: () => dispatch(getProjects(2, projQuery))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Doer)
