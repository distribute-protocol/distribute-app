import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import RoleIntro from '../components/shared/modals/onboarding/RoleIntro'
import TextContinue from '../components/shared/modals/TextContinue'
import RoleSelectionModal from '../components/shared/modals/onboarding/RoleSelectionModal'
import { getUserStatus } from '../actions/userActions'
import { eth } from '../utilities/blockchain'

class RoleSelection extends React.Component {
  constructor () {
    super()
    this.state = {
      firstModal: true,
      secondModal: false,
      thirdModal: false
    }
    this.changeRole = this.changeRole.bind(this)
    this.populateSidebar = this.populateSidebar.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.goBack = this.goBack.bind(this)
    this.goToProfile = this.goToProfile.bind(this)
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

  goBack () {
    if (this.state.secondModal === true) {
      this.setState({firstModal: true, secondModal: false})
    } else if (this.state.thirdModal === true) {
      this.setState({secondModal: true, thirdModal: false})
    }
  }

  goToProfile () {
    this.props.history.push('/profile')
  }

  populateSidebar () {
    this.setState({showIcons: true, secondModal: false, thirdModal: true})
  }

  closeModal () {
    this.setState({thirdModal: false})
    this.props.history.push('/' + this.state.role.toLowerCase())
  }

  render () {
    return (
      <div>
        <RoleIntro visible={this.state.firstModal} indicateRole={this.changeRole} handleCancel={this.goToProfile} />
        <RoleSelectionModal visible={this.state.secondModal} role={this.state.role} selectRole={this.populateSidebar} handleCancel={this.goBack} />
        <TextContinue visible={this.state.thirdModal} text={this.state.role} continue={this.closeModal} handleCancel={this.goBack} />
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
