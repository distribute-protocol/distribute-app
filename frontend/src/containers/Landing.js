import React from 'react'
import { connect } from 'react-redux'
import uport from '../utilities/uport'
import { Button } from 'antd'
import { loginUser } from '../actions/userActions'
import { eth } from '../utilities/blockchain'
import { getNetworkStatus } from '../actions/networkActions'

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
  render () {
    return (
      <div>
        <div style={{backgroundColor: '#CDCDCD', height: '68vh'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignContent: 'center', paddingTop: 24, paddingLeft: 23}}>
              <div>
                <svg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path fill-rule='evenodd' clip-rule='evenodd' d='M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z' fill='#A4D573' />
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
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontSize: 36, fontFamily: 'NowAltRegular'}}>A Platform for the Commons</div>
              { this.state.metamask
                ? <Button onClick={this.getUport}>
                  <div style={{backgroundColor: '#A4D573', color: 'white', fontSize: 18, fontFamily: 'NowAltRegular'}}>JOIN</div>
                </Button>
                : <Button onClick={this.getUport}>
                  <div style={{backgroundColor: '#A4D573', color: 'white', fontSize: 18, fontFamily: 'NowAltRegular'}}>GET METAMASK</div>
                </Button>
              }
            </div>
          </div>
        </div>
        <div>
          <div style={{display: 'flex', justifyContent: 'center', fontSize: 18, fontFamily: 'NowAltRegular'}}>This distributed organization requires:</div>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: 'NowAltRegular'}}>
              <svg width='167' height='72' viewBox='0 0 167 72' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect width='167' height='72' rx='13' fill='#5C50CA' />
              </svg>
              <div style={{textAlign: 'center'}}>uPort is a decentralized self-sovereign<br />identity platform.</div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: 'NowAltRegular'}}>
              <svg width='167' height='72' viewBox='0 0 167 72' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect width='167' height='72' rx='13' fill='#5C50CA' />
              </svg>
              <div style={{textAlign: 'center'}}>Metamask is an in-browser wallet that grants easy<br />access to the Ethereum blockchain.</div>
            </div>
          </div>
        </div>
        { /* <h1 className='display-3'>Welcome to Distribute</h1>
        <hr className='my-2' />
        <p>You need a uPort to continue. You can download the mobile app with one of the links below.</p>
        <p>Upon login, you will be prompted to receive your first reputation points.</p>
        <text>
          <a href='https://itunes.apple.com/us/app/uport-identity-wallet-ethereum/id1123434510?mt=8'>uPort iOS</a>
          <text> | </text>
          <a href='https://play.google.com/store/apps/details?id=com.uportMobile'>uPort Android</a>
        </text>

        <p className='lead' style={{marginTop: 30, alignItems: 'center'}}>
          <Button color='primary' onClick={this.getUport}>
            Connect with uPort
          </Button>
        </p> */}
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
