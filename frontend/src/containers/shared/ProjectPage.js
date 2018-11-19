import React from 'react'
import MiniSidebar from '../../components/shared/MiniSidebar'
import TitleBar from '../../components/shared/TitleBar'
import ProjectPageComponent from '../../components/shared/ProjectPageComponent'

class ProjectPage extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  componentWillReceiveProps (np) {
    if (np.project !== undefined) {
      // UNCOMMENT THIS
      // this.setState({project: np.project.project.data.project})
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
            project={this.props.project} />
        </div>
      </div>
    )
  }
}

export default ProjectPage
