/* global */

import React from 'react'
import { connect } from 'react-redux'
import MiniSidebar from '../../components/shared/MiniSidebar'
import TitleBar from '../../components/shared/TitleBar'
import { getUserStatus } from '../../actions/userActions'

class ProjectPage extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  render () {
    return (
      <div>
        <div style={{backgroundColor: 'white'}}>
          <MiniSidebar showIcons={this.props.showIcons} highlightIcon={this.props.highlightIcon} redirect={this.props.redirect} />
          <TitleBar role={this.props.highlightIcon} />
        </div>
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
    getProject: (userAccount) => dispatch(getUserStatus(userAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage)
