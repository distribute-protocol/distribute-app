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
import { lightgradient2 } from '../../styles/colors'
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
      role: 'Find',
      showSidebarIcons: true,
      ethPrice: 0
    }
    this.redirect = this.redirect.bind(this)
  }

  componentWillMount () {
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
      <div style={{ backgroundColor: lightgradient2, height: '100vh' }}>
        <MiniSidebar user={this.props.user} showIcons={this.state.showSidebarIcons} highlightIcon={this.state.role} redirect={this.redirect} />
        <TitleBar title={this.state.role} role={this.state.role} />
        <SearchProjectBar />
        <ProjectCardGrid nullText={<p>No proposals have currently been initiated.<br /> Do you have an idea that could help the network?</p>}
          nullAction={'Initiate'}
          role='Find'
          projectData={this.props.projects['1']} ethPrice={this.state.ethPrice} redirect={this.redirect} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects,
    // projects: {'1':[{address: '0x150y10571'}]},
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserStatusWallet: (userAccount) => dispatch(getUserStatusWallet(userAccount)),
    getProjects: () => dispatch(getProjects(1, projQuery))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Finder)
