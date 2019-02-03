import React from 'react'
import { Modal, Button } from 'antd'

class InitiatorWelcome extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false
    }
    this.handleOk = this.handleOk.bind(this)
  }

  componentWillReceiveProps (np) {
    if (np.visible === true) {
      this.setState({modalVisible: true})
    }
  }

  handleOk (propType) {
    this.props.continue(propType)
    this.setState({modalVisible: false})
  }

  render () {
    return (
      <Modal
        centered
        closable={false}
        visible={this.state.modalVisible}
        footer={null}
        maskClosable={false}
        width={810}
        bodyStyle={{height: 280, padding: 0}}
      >
        <div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <p style={{paddingTop: 30, fontSize: 20, fontFamily: 'NowAltRegular'}}>It looks like you don't have any tokens. You can head to the dashboard<br />to contribute money to the network and receive tokens.</p>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 39}}>
            <Button style={{backgroundColor: '#A4D573', color: 'white', width: 270, height: 65, fontSize: 20, fontFamily: 'NowAltRegular', textAlign: 'center'}} key='submit' onClick={() => this.handleOk('money')}>
              Go To Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default InitiatorWelcome
