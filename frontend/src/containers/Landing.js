import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import Onboarding from 'components/onboarding/modals/Onboarding'
import TextContinue from 'components/onboarding/modals/TextContinue'
import { loginUser, getUserStatusWallet } from 'actions/userActions'
import { eth, web3 } from 'utilities/blockchain'
import uport from 'utilities/uport'
import landingbackground from 'images/landingbackground3.png'
import hyphalogo from 'images/hyphalogo.png'
import uportlogo from 'images/logos/uportlogo.svg'
import metamasklogo from 'images/logos/metamaskfox.svg'
import styles from 'styles'
let { colors, fonts, typography, container } = styles

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
    const styles = {
      coverImage: {
        backgroundImage: `url(${landingbackground})`,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'absolute',
        width: '100%',
        height: '68.06%',
        left: 0,
        top: 0
      },
      headerRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        left: '1.6%',
        top: '2.47%',
        right: '1.6%',
        width: '100%'
      },
      brandText: {
        height: 35,
        width: 118,
        color: colors.white,
        fontFamily: fonts.font1,
        fontSize: 25,
        fontStyle: 'normal',
        fontWeight: '600',
        textAlign: 'center'
      }

    }
    return (
      <div style={container.body}>
        {this.state.clickedJoin
          ? <Onboarding skipFirst={this.state.hasEther} visible={this.state.clickedJoin} getUport={this.getUport} cancel={this.unclickJoin} />
          : null
        }
        {this.props.user.loggedIn
          ? <TextContinue text={'congrats'} visible={this.props.user.loggedIn} continue={this.profilePage} />
          : null
        }
        <div style={styles.coverImage}>
          { /* START OF TOP BAR */ }
          <div style={styles.headerRow}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img style={{
                height: 50,
                width: 50,
              }} src={hyphalogo} alt='hypha logo' />
              <div style={styles.brandText}>
                HYPHA
              </div>
            </div>

            <div style={{
              position: 'relative',
              top: '3.03%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Button style={Object.assign({},
                typography.text,
                { width: 135,
                  height: 42,
                  backgroundColor: colors.brandColor,
                  color: colors.white,
                  borderColor: colors.brandColor
                }
              )} onClick={this.handleJoin}>
                CONTRIBUTE
              </Button>
              <div style={{ display: 'flex', flexDirection: 'row', marginRight: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button style={{ color: colors.white, backgroundColor: 'rgba(0, 0, 0, 0.0)', borderWidth: 0 }}>
                  SIGN UP
                </Button>

                <Button style={{ color: colors.white, backgroundColor: 'rgba(0, 0, 0, 0.0)', borderWidth: 0 }}>
                  LOGIN
                </Button>
              </div>
            </div>
          </div>
          { /* END OF TOP BAR
               START OF PLATFORM TITLE */ }
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            top: '40.86%',
            width: '100%',
            flexWrap: 'wrap',
            height: '40%'
          }}>
            <div style={{
              fontFamily: fonts.font1,
              fontWeight: '600',
              fontSize: 36,
              textAlign: 'center',
              color: colors.white
            }}>
              A Platform for the Commons
            </div>
            <div>
              { this.state.metamask
                ? <Button style={{
                  width: 120,
                  height: 35,
                  marginTop: 20,
                  backgroundColor: colors.brandColor,
                  color: colors.white,
                  borderWidth: 0
                }} onClick={this.handleJoin}>
                  JOIN
                  </Button>
                : <Button style={{
                  height: 35,
                  marginTop: 20,
                  borderStyle: 'dashed',
                  borderColor: colors.black
                }} onClick={this.getMetaMask}>
                  Please Connect to MetaMask
                  </Button>
              }
            </div>
          </div>
          { /* END OF PLATFORM TITLE */ }
        </div>
        { /* START OF WHITE SPACE */ }
        <div style={{
          // height: '31.94%',
          width: '100%',
          position: 'absolute',
          top: '68.06%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={Object.assign({}, typography.text, { fontSize: 20, position: 'relative', marginTop: '2vh' })}>
            This distributed organization requires:
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1vh'}}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', alignItems: 'center', justifyContent: 'center', minWidth: 300, marginTop: '1vh' }}>
              <div style={{ height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <a href='https://uport.me' target='_blank'>
                  <img src={ uportlogo } alt='uPort logo' />
                </a>
              </div>
              <div style={Object.assign({}, typography.text, { paddingTop: 5 })}>
                uPort is a decentralized self-sovereign identity platform.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', alignItems: 'center', justifyContent: 'center', minWidth: 300, marginTop: '1vh' }}>
              <div style={{ height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <a href='https://metamask.io' target='_black'>
                  <img src={ metamasklogo } alt='MetaMask fox' />
                </a>
              </div>
              <div style={Object.assign({}, typography.text, { paddingTop: 5 })}>Metamask is an in-browser wallet that grants easy<br />access to the Ethereum blockchain.</div>
            </div>
          </div>
          <div style={{ marginTop: 20, height: 200, width: '100%', backgroundColor: colors.black }} />
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
