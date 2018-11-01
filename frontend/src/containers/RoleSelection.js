import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import RoleIntro from '../components/shared/modals/RoleIntro'
import RoleSelectionModal from '../components/shared/modals/RoleSelectionModal'
import { getUserStatus } from '../actions/userActions'
import { eth } from '../utilities/blockchain'

class RoleSelection extends React.Component {
  constructor () {
    super()
    this.state = {
      firstModal: true,
      secondModal: false
    }
    this.changeRole = this.changeRole.bind(this)
    this.populateSidebar = this.populateSidebar.bind(this)
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

  changeRole (role) {
    this.setState({firstModal: false, secondModal: true, role: role})
  }

  populateSidebar () {
    this.setState({showIcons: true, secondModal: false})
  }

  render () {
    return (
      <div>
        <RoleIntro visible={this.state.firstModal} indicateRole={this.changeRole} />
        <RoleSelectionModal visible={this.state.secondModal} role={this.state.role} selectRole={this.populateSidebar} />
        <Sidebar showIcons={this.state.showIcons} highlightIcon={this.state.role} />
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
