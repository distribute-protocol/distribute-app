import React from 'react'
import { connect } from 'react-redux'
import initiatorgray from '../../images/sidebaricons/standard/initiator-gray.svg'
import initiatorcolor from '../../images/sidebaricons/standard/initiator-color.svg'
import findergray from '../../images/sidebaricons/standard/finder-gray.svg'
import findercolor from '../../images/sidebaricons/standard/finder-color.svg'
import plannergray from '../../images/sidebaricons/standard/planner-gray.svg'
import plannercolor from '../../images/sidebaricons/standard/planner-color.svg'
import doergray from '../../images/sidebaricons/standard/doer-gray.svg'
import doercolor from '../../images/sidebaricons/standard/doer-color.svg'
import validatorgray from '../../images/sidebaricons/standard/validator-gray.svg'
import validatorcolor from '../../images/sidebaricons/standard/validator-color.svg'
import resolvergray from '../../images/sidebaricons/standard/resolver-gray.svg'
import resolvercolor from '../../images/sidebaricons/standard/resolver-color.svg'
import network from '../../images/sidebaricons/standard/network.svg'
import dashboard from '../../images/sidebaricons/standard/dashboard.svg'

class Sidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      showIcons: false,
      highlightIcons: []
    }
  }

  render () {
    let iconSize = 66
    let iconMargin = 35
    return (
      <div style={{ height: '100%', width: 100, position: 'fixed', backgroundColor: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className='App-title' style={{ color: 'white', marginTop: 5, fontSize: 18 }}>HYPHA</h1>
          <div style={{ display: 'flex', marginLeft: 2, width: 60, height: 60, borderRadius: 30, backgroundColor: '#fcfcfc', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
            <img style={{ width: 60, height: 60, borderRadius: 30, cursor: 'pointer' }} onClick={() => this.props.redirect('/profile')} alt='profile' src={typeof this.props.user.avatar !== 'undefined' ? this.props.user.avatar.uri : 'http://busybridgeng.com/wp-content/uploads/2017/05/generic-avatar.png'} />
          </div>
          <h3 style={{ color: '#FCFCFC', fontSize: 15 }}>{this.props.user.name.split(' ')[0]}</h3>
        </div>
        <div>
          { this.props.showIcons
            ? <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
              { this.props.highlightIcon === 'Initiator'
                ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={initiatorcolor} alt='initiator' onClick={() => this.props.redirect('/initiator')} />
                : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={initiatorgray} alt='initiator' onClick={() => this.props.redirect('/initiator')} />
              }
              { this.props.highlightIcon === 'Finder'
                ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={findercolor} alt='finder' onClick={() => this.props.redirect('/finder')} />
                : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={findergray} alt='finder' onClick={() => this.props.redirect('/finder')} />
              }
              { this.props.highlightIcon === 'Planner'
                ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={plannercolor} alt='planner' onClick={() => this.props.redirect('/planner')} />
                : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={plannergray} alt='planner' onClick={() => this.props.redirect('/planner')} />
              }
              { this.props.highlightIcon === 'Doer'
                ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={doercolor} alt='doer' onClick={() => this.props.redirect('/doer')} />
                : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={doergray} alt='doer' onClick={() => this.props.redirect('/doer')} />
              }
              { this.props.highlightIcon === 'Validator'
                ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={validatorcolor} alt='validator' onClick={() => this.props.redirect('/validator')} />
                : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={validatorgray} alt='validator' onClick={() => this.props.redirect('/validator')} />
              }
              { this.props.highlightIcon === 'Resolver'
                ? <img style={{ width: iconSize, height: iconSize, cursor: 'pointer' }} src={resolvercolor} alt='resolver' onClick={() => this.props.redirect('/resolver')} />
                : <img style={{ width: iconSize, height: iconSize, cursor: 'pointer' }} src={resolvergray} alt='resolver' onClick={() => this.props.redirect('resolver')} />
              }
            </div>
            : null
          }
        </div>
        { this.props.showIcons
          ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
            <img style={{ marginBottom: 15, cursor: 'pointer', height: 40, width: 40 }} onClick={() => this.props.redirect('/activitymonitor')} src={network} alt='network' />
            <img style={{ cursor: 'pointer', height: 40, width: 40 }} onClick={() => this.props.redirect('/dashboard')} src={dashboard} alt='dashboard' />
          </div>
          : null
        }
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
