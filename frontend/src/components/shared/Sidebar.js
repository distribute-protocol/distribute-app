import React from 'react'
import { connect } from 'react-redux'
import MiniSidebar from './MiniSidebar'
import FullSidebar from './FullSidebar'

const styleSelector = function (style, minimized) {
  const styles = {
    aside: {
      order: 0,
      minWidth: minimized ? 60 : 100,
      width: minimized ? 60 : 100,
      transition: 'width .4s, min-width .4s;'
    }
  }
  return styles[style]
}

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
    console.log('hey')
    this.setState({ minimized: !this.state.minimized })
  }
  render () {
    return (

      <aside style={styleSelector('aside', this.state.minimized)} onClick={this.toggleMinimize}>
        { !this.state.minimized
          ? <FullSidebar {...this.props} toggleMinimize={this.toggleMinimize} />
          : <MiniSidebar {...this.props} toggleMinimize={this.toggleMinimize} />
        }
      </aside>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user || {}
  }
}

export default connect(mapStateToProps)(Sidebar)
