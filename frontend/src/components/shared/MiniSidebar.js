import React from 'react'
import { connect } from 'react-redux'
import hamburger from '../../images/sidebaricons/minimized/hamburger.svg'
import avatar from '../../images/sidebaricons/minimized/avatar.svg'
import initiatorgray from '../../images/sidebaricons/minimized/initiator-gray.svg'
import initiatorcolor from '../../images/sidebaricons/minimized/initiator-color.svg'
import findergray from '../../images/sidebaricons/minimized/finder-gray.svg'
import findercolor from '../../images/sidebaricons/minimized/finder-color.svg'
import plannergray from '../../images/sidebaricons/minimized/planner-gray.svg'
import plannercolor from '../../images/sidebaricons/minimized/planner-color.svg'
import doergray from '../../images/sidebaricons/minimized/doer-gray.svg'
import doercolor from '../../images/sidebaricons/minimized/doer-color.svg'
import validatorgray from '../../images/sidebaricons/minimized/validator-gray.svg'
import validatorcolor from '../../images/sidebaricons/minimized/validator-color.svg'
import resolvergray from '../../images/sidebaricons/minimized/resolver-gray.svg'
import resolvercolor from '../../images/sidebaricons/minimized/resolver-color.svg'
import network from '../../images/sidebaricons/minimized/network.svg'
import dashboard from '../../images/sidebaricons/minimized/dashboard.svg'

class MiniSidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      highlightIcons: []
    }
  }

  render () {
    return (
      <div style={{height: '100%', width: 60, position: 'fixed', backgroundColor: '#111111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
          <img style={{cursor: 'pointer', marginTop: 15}} alt='hamburger' src={hamburger} />
          <img style={{width: 40, height: 40, borderRadius: 50, cursor: 'pointer', marginTop: 20}} onClick={() => this.props.redirect('/profile')} alt='profile' src={typeof this.props.user.avatar !== 'undefined' ? this.props.user.avatar : avatar} />
          { this.props.showIcons
            ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', marginTop: 10}}>
              { this.props.highlightIcon === 'Initiator' ? <img style={{paddingBottom: 5, cursor: 'pointer'}} src={initiatorcolor} alt='initiator' onClick={() => this.props.redirect('/initiator')} /> : <img style={{paddingBottom: 5, cursor: 'pointer'}} src={initiatorgray} alt='initiator' onClick={() => this.props.redirect('/initiator')} /> }
              { this.props.highlightIcon === 'Finder' ? <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={findercolor} alt='finder' onClick={() => this.props.redirect('/finder')} /> : <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={findergray} alt='finder' onClick={() => this.props.redirect('/finder')} /> }
              { this.props.highlightIcon === 'Planner' ? <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={plannercolor} alt='planner' onClick={() => this.props.redirect('/planner')} /> : <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={plannergray} alt='planner' onClick={() => this.props.redirect('/planner')} /> }
              { this.props.highlightIcon === 'Doer' ? <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={doercolor} alt='doer' onClick={() => this.props.redirect('/doer')} /> : <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={doergray} alt='doer' onClick={() => this.props.redirect('/doer')} /> }
              { this.props.highlightIcon === 'Validator' ? <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={validatorcolor} alt='validator' onClick={() => this.props.redirect('/validator')} /> : <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={validatorgray} alt='validator' onClick={() => this.props.redirect('/validator')} /> }
              { this.props.highlightIcon === 'Resolver' ? <img style={{paddingTop: 5, cursor: 'pointer'}} src={resolvercolor} alt='resolver' onClick={() => this.props.redirect('/resolver')} /> : <img style={{paddingTop: 5, cursor: 'pointer'}} src={resolvergray} alt='resolver' onClick={() => this.props.redirect('resolver')} /> }
            </div>
            : null
          }
        </div>
        { this.props.showIcons
          ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
            <img style={{paddingBottom: 5, cursor: 'pointer'}} onClick={() => this.props.redirect('/activitymonitor')} src={network} alt='network' />
            <img style={{paddingTop: 5, paddingBottom: 20, cursor: 'pointer'}} onClick={() => this.props.redirect('/dashboard')} src={dashboard} alt='dashboard' />
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

export default connect(mapStateToProps)(MiniSidebar)
