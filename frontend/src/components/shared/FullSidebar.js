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

class FullSidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      showIcons: false,
      highlightIcons: []
    }
  }

  render () {
    let iconSize = 66
    let iconMargin = 25
    return <div style={{ height: '100%', width: 100, position: 'fixed', backgroundColor: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ height: '15.625%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className='App-title' style={{ color: 'white', marginTop: 5, fontSize: 18, cursor: 'pointer' }} onClick={() => this.props.history.push('/')}>HYPHA</h1>
        <div style={{
          display: 'flex',
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#fcfcfc',
          alignSelf: 'center',
          backgroundImage: `url(${
            typeof this.props.user.avatar !== 'undefined'
              ? this.props.user.avatar
              : 'http://busybridgeng.com/wp-content/uploads/2017/05/generic-avatar.png'
          })`,
          cursor: 'pointer',
          backgroundSize: 'cover'
        }} onClick={() => this.props.history.push('/profile')} />
        <h3 style={{ color: '#FCFCFC', fontSize: 15, textAlign: 'center' }}>{this.props.user.name.split(' ')[0]}</h3>
      </div>
      <div style={{ height: '60%' }}>
        { this.props.showIcons
          ? <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
            { this.props.highlightIcon === 'initiate'
              ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={initiatorcolor} alt='initiate' onClick={() => this.props.history.push('/initiate')} />
              : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={initiatorgray} alt='initiate' onClick={() => this.props.history.push('/initiate')} />
            }
            { this.props.highlightIcon === 'find'
              ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={findercolor} alt='find' onClick={() => this.props.history.push('/find')} />
              : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={findergray} alt='find' onClick={() => this.props.history.push('/find')} />
            }
            { this.props.highlightIcon === 'plan'
              ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={plannercolor} alt='plan' onClick={() => this.props.history.push('/plan')} />
              : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={plannergray} alt='plan' onClick={() => this.props.history.push('/plan')} />
            }
            { this.props.highlightIcon === 'do'
              ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={doercolor} alt='do' onClick={() => this.props.history.push('/do')} />
              : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={doergray} alt='do' onClick={() => this.props.history.push('/do')} />
            }
            { this.props.highlightIcon === 'validate'
              ? <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={validatorcolor} alt='validate' onClick={() => this.props.history.push('/validate')} />
              : <img style={{ width: iconSize, height: iconSize, marginBottom: iconMargin, cursor: 'pointer' }} src={validatorgray} alt='validate' onClick={() => this.props.history.push('/validate')} />
            }
            { this.props.highlightIcon === 'resolver'
              ? <img style={{ width: iconSize, height: iconSize, cursor: 'pointer' }} src={resolvercolor} alt='resolve' onClick={() => this.props.history.push('/resolve')} />
              : <img style={{ width: iconSize, height: iconSize, cursor: 'pointer' }} src={resolvergray} alt='resolve' onClick={() => this.props.history.push('resolve')} />
            }
          </div>
          : null
        }
      </div>
      { this.props.showIcons
        ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60, height: '11.71875%' }}>
          <img style={{ marginBottom: 15, cursor: 'pointer', height: 40, width: 40 }} onClick={() => this.props.history.push('/activitymonitor')} src={network} alt='network' />
          <img style={{ cursor: 'pointer', height: 40, width: 40 }} onClick={() => this.props.history.push('/fund')} src={dashboard} alt='dashboard' />
        </div>
        : null
      }
      <div style={{ height: 30, width: 30 }} onClick={this.props.toggleMinimize} />
    </div>
  }
}

export default FullSidebar
