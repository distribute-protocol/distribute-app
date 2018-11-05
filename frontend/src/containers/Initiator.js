import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import InitiatorWelcome from '../components/shared/modals/initiator/InitiatorWelcome'
import InsufficientTokens from '../components/shared/modals/initiator/InsufficientTokens'
import { getUserStatus } from '../actions/userActions'
import { eth } from '../utilities/blockchain'

class Initiator extends React.Component {
  constructor () {
    super()
    this.state = {
      firstTime: true,
      role: 'Initiator',
      showSidebarIcons: true,
      firstModal: true,
      secondModal: false
    }
    this.choosePropType = this.choosePropType.bind(this)
    this.goToDashboard = this.goToDashboard.bind(this)
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

  choosePropType (propType) {
    this.setState({firstModal: false, propType: propType})
    if (propType === 'tokens' && this.props.user.userTokens === 0) {
      this.setState({secondModal: true})
    }
  }

  goToDashboard () {
    this.props.history.push('/dashboard')
  }

  render () {
    return (
      <div>
        <InitiatorWelcome visible={this.state.firstTime && this.state.firstModal} continue={this.choosePropType} />
        <InsufficientTokens visible={this.state.firstTime && this.state.secondModal} continue={this.goToDashboard} />
        <Sidebar showIcons={this.state.showSidebarIcons} highlightIcon={this.state.role} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Initiator)
