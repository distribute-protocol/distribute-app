import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import Onboarding from '../components/modals/Onboarding'
import TextContinue from '../components/modals/TextContinue'
import { loginUser, getUserStatusWallet } from '../actions/userActions'
import { eth, web3 } from '../utilities/blockchain'
import uport from '../utilities/uport'
import landingbackground from '../images/landingbackground3.png'
import hyphalogo from '../images/hyphalogo.png'
import uportlogo from '../images/logos/uportlogo.svg'
import metamasklogo from '../images/logos/metamaskfox.svg'
import { font1 } from '../styles/fonts'

class Landing extends React.Component {
  constructor () {
    super()
    this.state = {
      metamask: false,
      hasEther: false
    }
    this.getUport = this.getUport.bind(this)
    this.checkMetamaskConnected = this.checkMetamaskConnected.bind(this)
    this.checkMetamaskBalance = this.checkMetamaskBalance.bind(this)
    this.handleJoin = this.handleJoin.bind(this)
    this.unclickJoin = this.unclickJoin.bind(this)
    this.profilePage = this.profilePage.bind(this)
    this.checkTxStatus = this.checkTxStatus.bind(this)
  }

  componentWillMount () {
    this.checkMetamaskConnected()
  }

  checkMetamaskConnected () {
    if (!this.state.metamask && window.ethereum._metamask.isEnabled()) {
      this.checkMetamaskBalance()
    } else if (this.state.metamask && !window.ethereum._metamask.isEnabled()) {
      this.setState({ metamask: false })
      window.ethereum.enable()
      setTimeout(() => {
        this.checkMetamaskConnected()
      }, 1000)
    }
  }

  checkMetamaskBalance () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.getUserStatusWallet(accounts[0])
          eth.getBalance(accounts[0], (err, res) => {
            if (!err) {
              this.setState({ metamask: true, hasEther: res > 0 })
            }
          })
        } else {
          this.setState({ metamask: false })
        }
      }
    })
  }

  async handleJoin () {
    if (!this.state.metamask || !this.state.hasEther) {
      console.log('made it')
      try {
        let accounts = await eth.getAccounts()
        let balance
        if (accounts.length) {
          this.props.getUserStatusWallet(accounts[0])
          balance = await eth.getBalance(accounts[0])
        }
        this.setState({ hasEther: balance, clickedJoin: true })
      } catch (err) {

      }
    } else {
      this.setState({ clickedJoin: true })
    }
  }

  getUport () {
    const reqObj = {
      requested: ['name', 'avatar', 'country', 'email']
      // notifications: true
    } 
    uport.requestDisclosure(reqObj)
    uport.onResponse('disclosureReq').then(res => { 
      this.props.loginUser(res.payload)
      this.setState({clickedJoin: false})
      this.checkTxStatus()
    })
  }

  checkTxStatus () {
    if (this.props.user.registering !== undefined) {
      web3.eth.getTransactionReceipt(this.props.user.registering, (err, res) => {
        if (!err) {
          if (res.blockHash === null) {
            setTimeout(() => {
              this.checkTxStatus()
            }, 1000)
          } else {
            this.setState({loggedIn: true})
          }
        }
      })
    } else {
      setTimeout(() => {
        this.checkTxStatus()
      }, 1000)
    }
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
        {this.state.loggedIn
          ? <TextContinue text={'congrats'} visible={this.state.loggedIn} continue={this.profilePage} />
          : null
        }
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', backgroundImage: `url(${landingbackground})`, backgroundColor: 'rgba(0, 0, 0, 0.75)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '60vh'}}>
          { /* START OF TOP BAR */ }
          <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
              <div>
                <img src={hyphalogo} alt='hypha logo' width='50' height='50'/>

              </div>
              <div>
                <p style={{paddingLeft: 9, paddingTop: 20, fontSize: 25, fontFamily: font1, fontWeight: 600, color: 'white'}}>HYPHA</p>
              </div>
            </div>
            <p style={{marginTop: 20, marginRight: 22.5, color: 'white', fontSize: 20, fontFamily: 'NowAltRegular'}}>SIGN UP | LOGIN</p>
          </div>
          { /* END OF TOP BAR
               START OF PLATFORM TITLE */ }
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontSize: 36, fontFamily: 'NowAltRegular', textAlign: 'center', color: 'white'}}>A Platform for the Commons</div>
              { this.state.metamask
                ? <Button style={{backgroundColor: '#A4D573', marginTop: 10, paddingLeft: 30, paddingRight: 30, paddingTop: 3, paddingBottom: 5, border: '#D9D9D9'}} onClick={this.handleJoin}>
                  <p style={{color: 'white', fontSize: 18, fontFamily: font1}}>JOIN</p>
                </Button>
                : <Button style={{marginTop: 10, paddingTop: 4}} onClick={this.getMetaMask}>
                  <p style={{fontSize: 14, fontFamily: font1}}>Please Connect to MetaMask</p>
                </Button>
              }
            </div>
          </div>
          { /* END OF PLATFORM TITLE */ }
          <div /> { /* DO NOT DELETE --> NEED THESE FOR POSITIONING */ }
          <div /> { /* DO NOT DELETE --> NEED THESE FOR POSITIONING */ }
        </div>
        { /* START OF WHITE SPACE */ }
        <p style={{display: 'flex', justifyContent: 'center', marginTop: 15, fontSize: 18, fontFamily: font1, color: 'black'}}>
          This distributed organization requires:
        </p>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 15}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: font1}}>
            <img src={uportlogo} alt='uPort logo' />
            <p style={{textAlign: 'center', marginTop: 10, color: 'black'}}>uPort is a decentralized self-sovereign<br />identity platform.</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16, fontFamily: font1}}>
            <img src={metamasklogo} alt='MetaMask fox' />
            <p style={{textAlign: 'center', marginTop: 10, color: 'black'}}>Metamask is an in-browser wallet that grants easy<br />access to the Ethereum blockchain.</p>
          </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    getUserStatusWallet: (userAccount) => dispatch(getUserStatusWallet(userAccount)),
    loginUser: (credentials) => dispatch(loginUser(credentials))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Landing)
