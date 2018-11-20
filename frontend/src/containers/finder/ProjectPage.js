import React from 'react'
import MiniSidebar from '../../components/shared/MiniSidebar'
import TitleBar from '../../components/shared/TitleBar'
import ProjectPageComponent from '../../components/finder/ProjectPageComponent'

class ProjectPage extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  componentWillReceiveProps (np) {
    if (np.project !== undefined) {
      this.setState({project: np.project.project.data.project})
    }
  }

  render () {
    return (
      <div>
        <div style={{backgroundColor: 'white'}}>
          <MiniSidebar
            showIcons={this.props.showIcons}
            highlightIcon={this.props.highlightIcon}
            redirect={this.props.redirect} />
          <TitleBar
            role={this.props.highlightIcon} />
          <ProjectPageComponent
            usdPerEth={this.props.usdPerEth}
            project={this.state.project} />
        </div>
      </div>
    )
  }
}

export default ProjectPage
