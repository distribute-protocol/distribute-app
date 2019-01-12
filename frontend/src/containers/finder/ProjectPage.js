import React from 'react'
import MiniSidebar from '../../components/shared/MiniSidebar'
import TitleBar from '../../components/shared/TitleBar'
import ProjectPageComponent from '../../components/finder/ProjectPageComponent'
import { lightgradient1, lightgradient2, lightgradient3, lightgradient4, lightgradient5, lightgradient6 } from '../../styles/colors'

class ProjectPage extends React.Component {
  constructor () {
    super()
    this.state = {

    }
  }

  componentWillReceiveProps (np) {
    if (np.project !== undefined) {
      this.setState({ project: np.project.project.data.project })
    }
  }

  componentWillMount () {
    let color
    switch (this.props.location.pathname.split('/')[1]) {
      case 'initiator':
        color = lightgradient1
        break
      case 'finder':
        color = lightgradient2
        break
      case 'planner':
        color = lightgradient3
        break
      case 'doer':
        color = lightgradient4
        break
      case 'validator':
        color = lightgradient5
        break
      case 'resolver':
        color = lightgradient6
        break
      default:
        color = 'black'
    }
    this.setState({ color })
  }

  render () {
    console.log(this.props.location.state)
    console.log(this.props)
    let user, project
    if (typeof this.props.location.state !== 'undefined') {
      user = this.props.location.state.user
      project = this.props.location.state.project
    }

    let role = this.props.location.pathname.split('/')[1]
    return (
      <div style={{ backgroundColor: this.state.color, height: '100vh' }}>
        <MiniSidebar
          showIcons
          user={user}
          highlightIcon={this.props.location.pathname.split('/')[1]}
          redirect={this.props.redirect} />
        <TitleBar
          title={project ? project.name : 'Project Title'}
          role={role}
          project
        />
        <ProjectPageComponent
          usdPerEth={this.props.usdPerEth}
          project={this.state.project} />
      </div>
    )
  }
}

export default ProjectPage
