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
    return (
      <div style={{minHeight: '100vh', width: 150, backgroundColor: '#111111', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1 className='App-title' style={{color: 'white', marginTop: 10, fontSize: 18}}>HYPHA</h1>
        <div style={{width: 100, height: 100, borderRadius: 50, backgroundColor: '#fcfcfc'}}>
          <img style={{width: 100, height: 100, borderRadius: 50}} alt='profile' src={typeof this.props.user.avatar !== 'undefined' ? this.props.user.avatar.uri : 'http://busybridgeng.com/wp-content/uploads/2017/05/generic-avatar.png'} />
        </div>
        <h3 style={{color: '#FCFCFC', marginTop: 10, fontSize: 15}}>{this.props.user.name.split(' ')[0]}</h3>
        <div style={{marginTop: 10}}>
          { this.props.showIcons
            ? <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
              { this.props.highlightIcon === 'Initiator' ? <img style={{paddingBottom: 5, cursor: 'pointer'}} src={initiatorcolor} alt='initiator' onClick={() => this.props.redirect('/initiator')} /> : <img style={{cursor: 'pointer'}} src={initiatorgray} alt='initiator' onClick={() => this.props.redirect('/initiator')} /> }
              { this.props.highlightIcon === 'Finder' ? <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={findercolor} alt='finder' onClick={() => this.props.redirect('/finder')} /> : <img style={{cursor: 'pointer'}} src={findergray} alt='finder' onClick={() => this.props.redirect('/finder')} /> }
              { this.props.highlightIcon === 'Planner' ? <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={plannercolor} alt='planner' onClick={() => this.props.redirect('/planner')} /> : <img style={{cursor: 'pointer'}} src={plannergray} alt='planner' onClick={() => this.props.redirect('/planner')} /> }
              { this.props.highlightIcon === 'Doer' ? <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={doercolor} alt='doer' onClick={() => this.props.redirect('/doer')} /> : <img style={{cursor: 'pointer'}} src={doergray} alt='doer' onClick={() => this.props.redirect('/doer')} /> }
              { this.props.highlightIcon === 'Validator' ? <img style={{paddingTop: 5, paddingBottom: 5, cursor: 'pointer'}} src={validatorcolor} alt='validator' onClick={() => this.props.redirect('/validator')} /> : <img style={{cursor: 'pointer'}} src={validatorgray} alt='validator' onClick={() => this.props.redirect('/validator')} /> }
              { this.props.highlightIcon === 'Resolver' ? <img style={{paddingTop: 5, cursor: 'pointer'}} src={resolvercolor} alt='resolver' onClick={() => this.props.redirect('/resolver')} /> : <img style={{cursor: 'pointer'}} src={resolvergray} alt='resolver' onClick={() => this.props.redirect('resolver')} /> }
              <div style={{paddingTop: 38, paddingBottom: 10}}>
                <img style={{paddingRight: 5}} src={network} alt='network' />
                <img style={{paddingLeft: 5}}src={dashboard} alt='dashboard' />
              </div>
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
