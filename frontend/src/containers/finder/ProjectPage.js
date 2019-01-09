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
    console.log(this.props.location.pathname  )
    return (
      <div>
        <div style={{backgroundColor: 'white'}}>
          <MiniSidebar
            showIcons={true}
            highlightIcon={this.props.location.pathname.split('/')[1]}
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
