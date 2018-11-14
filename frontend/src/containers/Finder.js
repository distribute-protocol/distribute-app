/* global */

import React from 'react'
import { connect } from 'react-redux'
import MiniSidebar from '../components/shared/MiniSidebar'
import TitleBar from '../components/shared/TitleBar'
import SearchProjectBar from '../components/shared/SearchProjectBar'
import { getUserStatus } from '../actions/userActions'
// import { getNetworkStatus } from '../actions/networkActions'
import { proposeProject } from '../actions/projectActions'
// import { eth, web3, dt } from '../utilities/blockchain'

class Initiator extends React.Component {
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
    // eth.getAccounts(async (err, accounts) => {
    //   if (!err) {
    //     if (accounts.length) {
    //       this.props.getUserStatus(accounts[0])
    //     }
    //   }
    // })
    // this.getContractValues()
    // this.getNetworkStatus()
  }

  redirect (url) {
    this.props.history.push(url)
  }

  render () {
    return (
      <div>
        <MiniSidebar showIcons={this.state.showSidebarIcons} highlightIcon={this.state.role} redirect={this.redirect} />
        <TitleBar role={this.state.role} />
        <SearchProjectBar />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    network: state.network,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proposeProject: (type, projObj, txObj) => dispatch(proposeProject(type, projObj, txObj)),
    // getNetworkStatus: () => dispatch(getNetworkStatus()),
    getUserStatus: (userAccount) => dispatch(getUserStatus(userAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Initiator)
