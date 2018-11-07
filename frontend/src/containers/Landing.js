import React from 'react'
import { connect } from 'react-redux'
import uport from '../utilities/uport'
import { Button } from 'antd'
import Onboarding from '../components/modals/Onboarding'
import TextContinue from '../components/modals/TextContinue'
import { loginUser } from '../actions/userActions'
import { eth } from '../utilities/blockchain'
import landingbackground from '../images/landingbackground.svg'
import uportlogo from '../images/logos/uportlogo.svg'
import metamasklogo from '../images/logos/metamaskfox.svg'

class Landing extends React.Component {
  constructor () {
    super()
    this.state = {
      metamask: false,
      hasEther: false
    }
    this.getUport = this.getUport.bind(this)
    this.checkMetamaskConnected = this.checkMetamaskConnected.bind(this)
    this.checkMetamask = this.checkMetamask.bind(this)
    this.handleJoin = this.handleJoin.bind(this)
    this.unclickJoin = this.unclickJoin.bind(this)
    this.profilePage = this.profilePage.bind(this)
  }

  componentWillMount () {
    this.checkMetamaskConnected()
  }

  checkMetamaskConnected () {
    if (!this.state.metamask && window.ethereum._metamask.isEnabled()) {
      this.checkMetamask()
    } else if (this.state.metamask && !window.ethereum._metamask.isEnabled()) {
      this.setState({metamask: false})
      window.ethereum.enable()
    }
    setTimeout(() => {
      this.checkMetamaskConnected()
    }, 1000)
  }

  checkMetamask () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          eth.getBalance(accounts[0], (err, res) => {
            if (!err) {
              if (res > 0) {
                this.setState({metamask: true, hasEther: true})
              } else {
                this.setState({metamask: true, hasEther: false})
              }
            }
          })
        } else {
          this.setState({metamask: false})
        }
      }
    })
  }

  handleJoin () {
    if (!this.state.metamask || !this.state.hasEther) {
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
    } else {
      this.setState({clickedJoin: true})
    }
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

  unclickJoin () {
    this.setState({clickedJoin: false})
  }

  render () {
    return (
      <div>
        {this.state.clickedJoin
          ? <Onboarding skipFirst={this.state.hasEther} visible={this.state.clickedJoin} getUport={this.getUport} cancel={this.unclickJoin} />
          : null
        }
        <TextContinue text={'congrats'} visible={this.state.loggedin} continue={this.profilePage} />
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', backgroundImage: `url(${landingbackground})`, backgroundColor: 'rgba(0, 0, 0, 0.75)', height: '60vh'}}>
          { /* START OF TOP BAR */ }
          <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', paddingTop: 24, paddingLeft: 23}}>
              <div>
                <svg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path fillRule='evenodd' clipRule='evenodd' d='M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z' fill='#A4D573' />
                </svg>
              </div>
              <div>
                <p style={{paddingLeft: 9, paddingTop: 20, fontSize: 25, fontFamily: 'PingFang SC', fontWeight: 600, color: 'white'}}>HYPHA</p>
              </div>
            </div>
            <p style={{paddingTop: 28.5, paddingRight: 66.5, color: 'white', fontSize: 20, fontFamily: 'NowAltRegular'}}>SIGN UP | LOGIN</p>
          </div>
          { /* END OF TOP BAR
               START OF PLATFORM TITLE */ }
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontSize: 36, fontFamily: 'NowAltRegular', textAlign: 'center', color: 'white'}}>A Platform for the Commons</div>
              { this.state.metamask
                ? <Button style={{backgroundColor: '#A4D573', marginTop: 10, paddingTop: 3, border: '#D9D9D9'}} onClick={this.handleJoin}>
                  <p style={{color: 'white', fontSize: 18, fontFamily: 'PingFang SC'}}>JOIN</p>
                </Button>
                : <Button style={{marginTop: 10, paddingTop: 4}} onClick={this.getMetaMask}>
                  <p style={{fontSize: 14, fontFamily: 'PingFang SC'}}>Please Connect to MetaMask</p>
                </Button>
              }
            </div>
          </div>
          { /* END OF PLATFORM TITLE */ }
          <div /> { /* DO NOT DELETE --> NEED THESE FOR POSITIONING */ }
          <div /> { /* DO NOT DELETE --> NEED THESE FOR POSITIONING */ }
        </div>
        { /* START OF WHITE SPACE */ }
        <p style={{display: 'flex', justifyContent: 'center', marginTop: 15, fontSize: 18, fontFamily: 'NowAltRegular', color: 'black'}}>
          This distributed organization requires:
        </p>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 15}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: 'NowAltRegular'}}>
            <img src={uportlogo} alt='uPort logo' />
            <p style={{textAlign: 'center', marginTop: 10, color: 'black'}}>uPort is a decentralized self-sovereign<br />identity platform.</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: 'NowAltRegular'}}>
            <img src={metamasklogo} alt='MetaMask fox' />
            <p style={{textAlign: 'center', marginTop: 10, color: 'black'}}>Metamask is an in-browser wallet that grants easy<br />access to the Ethereum blockchain.</p>
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
