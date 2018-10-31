import React from 'react'
import { connect } from 'react-redux'
import uport from '../utilities/uport'
import { Button } from 'antd'
import OnboardingModal from '../components/shared/OnboardingModal'
import TextContinueModal from '../components/shared/TextContinueModal'
import { loginUser } from '../actions/userActions'
import { eth } from '../utilities/blockchain'
import uportlogo from '../images/uportlogo.svg'
import metamasklogo from '../images/metamaskfox.svg'

class Landing extends React.Component {
  constructor () {
    super()
    this.state = {
      metamask: false,
      hasEther: false
    }
    this.getUport = this.getUport.bind(this)
    this.checkMetamask = this.checkMetamask.bind(this)
    this.handleJoin = this.handleJoin.bind(this)
    this.profilePage = this.profilePage.bind(this)
  }

  componentWillMount () {
    this.checkMetamask()
  }

  checkMetamask () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          eth.getBalance(accounts[0], (err, res) => {
            if (!err) {
              this.setState({metamask: true})
            }
          })
        } else {
          this.setState({metamask: false})
        }
      }
    })
  }

  handleJoin () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          eth.getBalance(accounts[0], (err, res) => {
            if (!err) {
              if (res > 0) {
                this.setState({hasEther: true, clickedJoin: true})
              } else {
                this.setState({hasEther: false, clickedJoin: true})
              }
            }
          })
        }
      }
    })
  }

  getUport () {
    uport.requestCredentials({
      requested: ['name', 'avatar'],
      notifications: true
    }).then((credentials) => {
      this.props.loginUser(credentials)
      this.setState({clickedJoin: false, loggedin: true})
    })
  }

  getMetaMask () {
    window.open('https://metamask.io/')
  }

  profilePage () {
    this.props.history.push('/profile')
  }

  render () {
    return (
      <div>
        <OnboardingModal skipFirst={this.state.hasEther} visible={this.state.clickedJoin} getUport={this.getUport} />
        <TextContinueModal text={'congrats'} visible={this.state.loggedin} continue={this.profilePage} />
        <div style={{backgroundColor: '#CDCDCD', height: '60vh'}}>
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
                ? <Button style={{backgroundColor: '#A4D573', marginTop: 10, paddingTop: 3}} onClick={this.handleJoin}>
                  <p style={{color: 'white', fontSize: 18, fontFamily: 'NowAltRegular'}}>JOIN</p>
                </Button>
                : <Button style={{marginTop: 10, paddingTop: 4}} onClick={this.getMetaMask}>
                  <p style={{fontSize: 14, fontFamily: 'PingFang SC'}}>Please Connect to MetaMask</p>
                </Button>
              }
            </div>
          </div>
          { /* END OF PLATFORM TITLE */ }
        </div>
        { /* START OF WHITE SPACE */ }
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 15, fontSize: 18, fontFamily: 'NowAltRegular'}}>
          This distributed organization requires:
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 15}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: 'NowAltRegular'}}>
            <img src={uportlogo} alt='uPort logo' />
            <div style={{textAlign: 'center', marginTop: 10}}>uPort is a decentralized self-sovereign<br />identity platform.</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: 'NowAltRegular'}}>
            <img src={metamasklogo} alt='MetaMask fox' />
            <div style={{textAlign: 'center', marginTop: 10}}>Metamask is an in-browser wallet that grants easy<br />access to the Ethereum blockchain.</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (credentials) => dispatch(loginUser(credentials))
  }
}
export default connect(null, mapDispatchToProps)(Landing)
