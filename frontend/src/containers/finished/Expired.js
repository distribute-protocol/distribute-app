import React from 'react'
import Sidebar from '../../components/shared/Sidebar'
import Project from '../project/Finished'
import { connect } from 'react-redux'
import { P } from '../../utilities/blockchain'
import * as _ from 'lodash'

class Expired extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
  }

  componentWillMount () {
    if (_.isEmpty(this.props.user)) {
    }
  }

  componentWillReceiveProps (np) {
    let projectsArr

    function projectState (address) {
      return new Promise(async (resolve, reject) => {
        let state = P.at(address).state()
        resolve(state)
      })
    }

    let projects = Object.keys(np.projects).map((projAddr, i) => {
      return projectState(projAddr)
        .then(state => {
          if (state.toNumber() === 8) {
            return np.projects[projAddr]
          }
        })
    })

    Promise.all(projects)
      .then(results => {
        projectsArr = _.compact(results)
        this.setState({projects: projectsArr})
      })
      .catch(e => {
        console.error(e)
      })
  }

  render () {
    const projects = this.state.projects.map((proj, i) => {
      return <Project
        key={i}
        index={i}
        address={proj.address}
      />
    })

    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Expired Projects</h3>
          </header>
          <div style={{paddingLeft: '30px', paddingRight: '30px'}}>
            {projects}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: state.projects.allProjects
  }
}

export default connect(mapStateToProps)(Expired)
