import React from 'react'
import { connect } from 'react-redux'

let titleStyle = {
  color: '#FCFCFC',
  marginTop: 10,
  marginLeft: 10,
  fontFamily: 'Lato'
}

class Sidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      showIcons: false,
      highlightIcons: []
    }
    this.toggleShow = this.toggleShow.bind(this)
  }

  toggleShow (val) {
    this.setState({[val]: !this.state[val]})
  }

  render () {
    return (
      <div style={{height: '100vh', width: 150, backgroundColor: '#111111', position: 'fixed', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1 className='App-title' style={{color: 'white', marginTop: 17, fontSize: 18}}>HYPHA</h1>
        <div style={{width: 100, height: 100, borderRadius: 50, backgroundColor: '#fcfcfc', marginTop: 19}}>
          <img style={{width: 100, height: 100, borderRadius: 50}} alt='profile' src={typeof this.props.user.avatar !== 'undefined' ? this.props.user.avatar.uri : 'http://busybridgeng.com/wp-content/uploads/2017/05/generic-avatar.png'} />
        </div>
        <h3 style={{color: '#FCFCFC', marginTop: 11, fontSize: 15}}>{this.props.user.name.split(' ')[0]}</h3>
        <div style={{alignItems: 'flex-start', marginTop: 20}}>
          { this.state.showIcons
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
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user || {}
  }
}

export default connect(mapStateToProps)(Sidebar)
