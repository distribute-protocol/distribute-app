import React from 'react'
import { connect } from 'react-redux'
import uport from '../utilities/uport'
import { Button } from 'antd'
import { loginUser } from '../actions/userActions'
import { eth } from '../utilities/blockchain'
import { getNetworkStatus } from '../actions/networkActions'
import uportlogo from '../images/uportlogo.svg'
import metamasklogo from '../images/metamaskfox.svg'

class Landing extends React.Component {
  constructor () {
    super()
    this.state = {
      metamask: false
    }
    this.getUport = this.getUport.bind(this)
    this.checkMetamask = this.checkMetamask.bind(this)
  }

  componentWillMount () {
    this.checkMetamask()
  }

  checkMetamask () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          // get user token balance
          this.setState({metamask: true})
        } else {
          this.setState({metamask: false})
        }
      }
    })
  }

  getUport () {
    uport.requestCredentials({
      requested: ['name', 'avatar'],
      notifications: true
    }).then((credentials) => {
      this.props.getNetworkStatus()
      this.props.loginUser(credentials)
    })
  }

  getMetaMask () {
    console.log('metamask')
  }

  render () {
    return (
      <div>
        <div style={{backgroundColor: '#CDCDCD', height: '68vh'}}>
          { /* START OF TOP BAR */ }
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', paddingTop: 24, paddingLeft: 23}}>
              <div>
                <svg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path fillRule='evenodd' clipRule='evenodd' d='M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z' fill='#A4D573' />
                </svg>
              </div>
              <div style={{paddingLeft: 9, fontSize: 20, fontFamily: 'NowAltRegular'}}>
                DISTRIBUTE<br />NETWORK
              </div>
            </div>
            <div style={{paddingTop: 27, paddingRight: 66.5, color: 'white', fontSize: 20, fontFamily: 'NowAltRegular'}}>
              SIGN UP | LOGIN
            </div>
          </div>
          { /* END OF TOP BAR
               START OF PLATFORM TITLE */ }
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontSize: 36, fontFamily: 'NowAltRegular'}}>A Platform for the Commons</div>
              { this.state.metamask
                ? <Button onClick={this.getUport}>
                  <div style={{backgroundColor: '#A4D573', color: 'white', fontSize: 18, fontFamily: 'NowAltRegular'}}>JOIN</div>
                </Button>
                : <Button onClick={this.getMetaMask}>
                  <div style={{fontSize: 14, fontFamily: 'PingFang SC'}}>Please Connect to MetaMask</div>
                </Button>
              }
            </div>
          </div>
          { /* END OF PLATFORM TITLE */ }
        </div>
        { /* START OF WHITE SPACE */ }
        <div style={{display: 'flex', justifyContent: 'center', fontSize: 18, fontFamily: 'NowAltRegular'}}>
          This distributed organization requires:
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: 'NowAltRegular'}}>
            <img src={uportlogo} alt='uPort logo' />
            <div style={{textAlign: 'center'}}>uPort is a decentralized self-sovereign<br />identity platform.</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: 'NowAltRegular'}}>
            <img src={metamasklogo} alt='MetaMask fox' />
            <div style={{textAlign: 'center'}}>Metamask is an in-browser wallet that grants easy<br />access to the Ethereum blockchain.</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (credentials) => dispatch(loginUser(credentials)),
    getNetworkStatus: () => dispatch(getNetworkStatus())
  }
}
export default connect(null, mapDispatchToProps)(Landing)
