import React from 'react'
import { connect } from 'react-redux'
import MiniSidebar from './MiniSidebar'
import FullSidebar from './FullSidebar'
class Sidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      showIcons: false,
      highlightIcons: [],
      minimized: false
    }
    this.toggleMinimize = this.toggleMinimize.bind(this)
  }
  componentDidMount (props, state) {
    this.setState({ minimized: this.props.minimized })
  }
  toggleMinimize () {
    this.setState({ minimized: !this.state.minimized })
  }
  render () {
    return (
      <div onClick={this.toggleMinimize}>
        { !this.state.minimized
          ? <FullSidebar {...this.props} toggleMinimize={this.toggleMinimize} />
          : <MiniSidebar {...this.props} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user || {}
  }
}

export default connect(mapStateToProps)(Sidebar)
