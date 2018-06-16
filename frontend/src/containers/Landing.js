import React from 'react'
import { connect } from 'react-redux'
import uport from '../utilities/uport'

import { Button } from 'antd'

import { loginUser } from '../actions/userActions'

class Landing extends React.Component {
  constructor () {
    super()
    this.getUport = this.getUport.bind(this)
  }
  getUport () {
    uport.requestCredentials({
      requested: ['name', 'avatar'],
      notifications: true
    }).then((credentials) => {
      console.log(credentials)
      this.props.loginUser(credentials)
      // this.props.login()
    })
  }
  render () {
    return (
      <div style={{padding: 30}}>
        <h1 className='display-3'>Welcome to Distribute</h1>
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
        </p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (credentials) => dispatch(loginUser(credentials))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Landing)
