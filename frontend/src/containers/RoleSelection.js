import React from 'react'
import { connect } from 'react-redux'
import RoleSelectionComponent from '../components/RoleSelection'
import { getUserStatus } from '../actions/userActions'
import { eth } from '../utilities/blockchain'

class RoleSelection extends React.Component {
  constructor () {
    super()
    this.state = {
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
      <RoleSelectionComponent />
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
