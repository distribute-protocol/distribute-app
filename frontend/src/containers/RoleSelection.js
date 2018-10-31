import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import RoleIntroModal from '../components/shared/RoleIntroModal'
import { getUserStatus } from '../actions/userActions'
import { eth } from '../utilities/blockchain'

class RoleSelection extends React.Component {
  constructor () {
    super()
    this.state = {
      firstProfile: true
    }
  }

  componentWillMount () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.getUserStatus(accounts[0])
        }
      }
    })
  }

  render () {
    return (
      <div>
        <RoleIntroModal visible={this.state.firstProfile} />
        <Sidebar />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user || {},
    network: state.network
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserStatus: (userAccount) => dispatch(getUserStatus(userAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleSelection)
