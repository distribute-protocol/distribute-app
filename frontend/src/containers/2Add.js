import React from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import { Button } from 'antd'
import { push } from 'react-router-redux'
import { eth, P } from '../utilities/blockchain'
import Project from './project/2Add'
import fastforward from '../utilities/fastforward'
import * as _ from 'lodash'

class Add extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    this.fastForward = this.fastForward.bind(this)
  }

  componentWillMount () {
    eth.getAccounts((err, result) => {
      if (!err) {
        if (result.length) {
          // this.props.getStakedProjects()
        } else {
          console.log('Please Unlock MetaMask')
        }
      }
    })
  }
  componentWillReceiveProps (np) {
    let projectsArr

    function projectState (address) {
      return new Promise(async (resolve, reject) => {
        let proj = P.at(address)
        let state = await proj.state()
        resolve(state)
      })
    }

    let projects = Object.keys(np.projects).map((projAddr, i) => {
      return projectState(projAddr)
        .then(async (state) => {
          if (state.toNumber() === 2) {
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

// fast forward Ganache 1 week
  async fastForward () {
    await fastforward(7 * 24 * 60 * 60)
  }

  render () {
    const projects = typeof this.props.projects !== `undefined`
      ? this.props.projects.map((proj, i) => {
        return <Project
          key={i}
          index={i}
          address={proj.address}
          project={proj}
        />
      })
      : []
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Add Tasks to Open Projects</h3>
            <Button type='danger' onClick={this.fastForward}>fast forward 1 week</Button>
            <h6>ONLY DO THIS IF YOU ARE READY TO MOVE EVERY PROJECT TO THE NEXT STATE</h6>
            <h6>IF A PROJECT HAS NO TASK SUBMISSIONS IT WILL FAIL AND YOU WILL LOSE YOUR STAKED TOKENS</h6>
          </header>
          <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
            {projects}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects.allProjects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reroute: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add)
