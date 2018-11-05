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
    this.toggleShow = this.toggleShow.bind(this)
  }

  toggleShow () {
    console.log('goob')
    // this.setState({[val]: !this.state[val]})
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
              { this.props.highlightIcon === 'Initiator' ? <img src={initiatorcolor} alt='initiator' onClick={() => this.toggleShow()} /> : <img src={initiatorgray} alt='initiator' /> }
              { this.props.highlightIcon === 'Finder' ? <img src={findercolor} alt='finder' /> : <img src={findergray} alt='finder' /> }
              { this.props.highlightIcon === 'Planner' ? <img src={plannercolor} alt='planner' /> : <img src={plannergray} alt='planner' /> }
              { this.props.highlightIcon === 'Doer' ? <img src={doercolor} alt='doer' /> : <img src={doergray} alt='doer' /> }
              { this.props.highlightIcon === 'Validator' ? <img src={validatorcolor} alt='validator' /> : <img src={validatorgray} alt='validator' /> }
              { this.props.highlightIcon === 'Resolver' ? <img src={resolvercolor} alt='resolver' /> : <img src={resolvergray} alt='resolver' /> }
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
