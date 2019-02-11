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
        bodyStyle={{height: 419, padding: 0}}
      >
        <div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <p style={{paddingTop: 28, fontSize: 20, fontFamily: 'Lato'}}>Welcome to the Initiator role. Your job is to seed the network with the best<br />ideas. This could be a local wireless node on your block, an urban garden on the<br />street corner, or even a solar array on a church. It's all up to you. You will stake a<br />small percentage of the ideas cost with either money or clout to ensure that you<br />think it’s a good idea. </p>
            <p style={{paddingTop: 30, fontSize: 20, fontFamily: 'Lato'}}>Are you ready to initiate?</p>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 39}}>
            <Button style={{backgroundColor: '#326BC1', color: 'white', width: 270, height: 65, fontSize: 20, textAlign: 'center'}} key='continuemoney' onClick={() => this.handleOk('tokens')}>
              Continue With Money
            </Button>
            <Button style={{backgroundColor: '#F5A623', color: 'white', width: 270, height: 65, fontSize: 20, textAlign: 'center'}} key='continueclout' onClick={() => this.handleOk('rep')}>
              Continue With Clout
            </Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default InitiatorWelcome
