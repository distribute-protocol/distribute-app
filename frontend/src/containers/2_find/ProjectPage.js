import React from 'react'
import MiniSidebar from '../../components/shared/MiniSidebar'
import TitleBar from '../../components/shared/TitleBar'
import FindVerificationModal from 'components/2_find/modals/FindVerificationModal'
import ProjectPageComponent from '../../components/2_find/ProjectPageComponent'
import { lightgradient1, lightgradient2, lightgradient3, lightgradient4, lightgradient5, lightgradient6 } from '../../styles/colors'

class ProjectPage extends React.Component {
  constructor () {
    super()
    this.state = {
      txModal: false,
      type: ''
    }
    this.redirect = this.redirect.bind(this)
    this.launchModal = this.launchModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillReceiveProps (np) {
    if (np.project !== undefined) {
      this.setState({ project: np.project.project.data.project })
    }
  }

  componentWillMount () {
    let color
    let pathname = this.props.location ? this.props.location.pathname.split('/')[1] : null
    switch (pathname) {
      case 'initiate':
        color = lightgradient1
        break
      case 'find':
        color = lightgradient2
        break
      case 'plan':
        color = lightgradient3
        break
      case 'do':
        color = lightgradient4
        break
      case 'validate':
        color = lightgradient5
        break
      case 'resolve':
        color = lightgradient6
        break
      default:
        color = 'black'
    }
    this.setState({ color })
  }

  redirect (url, state) {
    this.props.history.push(url, Object.assign({}, state, { user: this.props.user }))
  }
  launchModal (type, action) {
    this.setState({ txModal: true, type, action })
  }

  closeModal (type, action) {
    this.setState({ txModal: false })
  }
  render () {
    // console.log(this.props.location.state)
    // console.log(this.props)
    let user, project, ethPrice
    if (typeof this.props.location.state !== 'undefined') {
      user = this.props.location.state.user
      project = this.props.location.state.project
      ethPrice = this.props.location.state.ethPrice
    }

    let role = this.props.location.pathname.split('/')[1]
    // console.log(user, project, ethPrice, role)
    return (
      <div style={{ backgroundColor: this.state.color, minHeight: '100vh' }}>
        <FindVerificationModal user={user} ethPrice={ethPrice} visible={this.state.txModal} closeModal={this.closeModal} action={this.state.action} type={this.state.type} data={project} />
        <MiniSidebar
          showIcons
          user={user}
          highlightIcon={this.props.location.pathname.split('/')[1]}
          redirect={this.redirect} />
        <TitleBar
          title={project ? project.name : 'Project Title'}
          role={role}
          project
        />
        <ProjectPageComponent
          launchModal={this.launchModal}
          ethPrice={ethPrice}
          project={project} />
      </div>
    )
  }
}

export default ProjectPage
