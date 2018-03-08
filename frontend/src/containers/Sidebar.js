import React from 'react'
import { connect } from 'react-redux'

let titleStyle = {
  color: '#FCFCFC',
  marginTop: 10,
  marginLeft: 10,
  fontSize: 20,
  fontFamily: 'helvetica'
}
let titleBarStyle = {
  color: '#000',
  backgroundColor: '#FCFCFC',
  marginTop: 10,
  fontSize: 20,
  fontFamily: 'helvetica',
  fontWeight: 100,
  padding: 10
}
class Sidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      actions: false,
      projects: false
    }
    this.toggleShow = this.toggleShow.bind(this)
  }
  toggleShow (val) {
    this.setState({[val]: !this.state[val]})
  }
  render () {
    return (
      <div style={{height: '100vh', width: 200, backgroundColor: '#111111', position: 'fixed', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1 className='App-title' style={{color: 'white', marginTop: 20}}>distribute</h1>
        <div style={{width: 100, height: 100, borderRadius: 50, backgroundColor: '#fcfcfc', marginTop: 20}}>
          <img style={{width: 100, height: 100, borderRadius: 50}} alt='profile' src={typeof this.props.user.avatar !== 'undefined' ? this.props.user.avatar.uri : ''} />
        </div>
        <h3 style={{color: '#FCFCFC', marginTop: 15}}>{this.props.user.name}</h3>
        <div style={{alignItems: 'flex-start', marginTop: 20}}>
          <a href='/status'><h3 className='ActionText' style={Object.assign({}, titleStyle, {textAlign: 'center'})}>Network Status</h3></a>
          {/* <a href='/projects'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Current Projects</h3></a> */}
          <h3 onClick={() => this.toggleShow('actions')} style={Object.assign({}, titleBarStyle, {textAlign: 'center'})}>Projects Actions</h3>
          { this.state.actions
            ? <div>
              <a href='/propose'><h3 className='ActionText' style={titleStyle}>Propose</h3></a>
              <a href='/stake'><h3 className='ActionText' style={titleStyle}>Stake</h3></a>
              <a href='/add'><h3 className='ActionText' style={titleStyle}>Add Tasks</h3></a>
              <a href='/claim'><h3 className='ActionText' style={titleStyle}>Claim Tasks</h3></a>
              <a href='/validate'><h3 className='ActionText' style={titleStyle}>Validate</h3></a>
              <a href='/vote'><h3 className='ActionText' style={titleStyle}>Vote</h3></a>
            </div>
            : null
          }
          <h3 onClick={() => this.toggleShow('projects')} style={Object.assign({}, titleBarStyle, {textAlign: 'center'})}>Finished Projects</h3>
          { this.state.projects
            ? <div>
              <a href='/complete'><h3 className='ActionText' style={titleStyle}>Complete</h3></a>
              <a href='/failed'><h3 className='ActionText' style={titleStyle}>Failed</h3></a>
              <a href='/expired'><h3 className='ActionText' style={titleStyle}>Expired</h3></a>
            </div>
            : null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps)(Sidebar)
