import React from 'react'
import { connect } from 'react-redux'
import Project from '../components/shared/Project'

class Status extends React.Component {
  render () {
    const projects = this.props.projects.projects.map((proj, i) => {
      return <Project key={i} cost={proj.cost} description={proj.description} index={i} stakingPeriod={proj.stakingPeriod} />
    })
    return (
      <div style={{marginLeft: 200}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{marginLeft: 20, marginTop: 40}}>
            <h3>Stakeable Proposals</h3>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <table style={{width: 500, border: '1px solid black'}}>
                <thead>
                  <tr>
                    <th>Project Description</th>
                    <th>Project Cost (ether)</th>
                    <th>Staking End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     proposeProject: (projectDetails) => dispatch(proposeProject(projectDetails))
//   }
// }

export default connect(mapStateToProps)(Status)
