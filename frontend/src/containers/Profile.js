import React from 'react'
import { connect } from 'react-redux'
import ProfileComponent from '../components/Profile'
import TextContinue from '../components/shared/modals/TextContinue'
import { getUserStatus } from '../actions/userActions'
import { eth } from '../utilities/blockchain'

class Profile extends React.Component {
  constructor () {
    super()
    this.state = {
      firstProfile: true
    }
    this.roleSelection = this.roleSelection.bind(this)
    this.closeLastModal = this.closeLastModal.bind(this)
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

  closeLastModal () {
    this.setState({firstProfile: false})
  }

  roleSelection () {
    this.props.history.push('/roleselection')
  }

  render () {
    return (
      <div>
        <TextContinue visible={this.state.firstProfile} text={'firstprofile'} continue={this.closeLastModal} />
        <ProfileComponent
          name={this.props.user.name}
          location={'Brooklyn, NY'}
          handleSave={this.roleSelection}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
