import React from 'react'
import { Modal, Button } from 'antd'

class TextContinue extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentWillReceiveProps (np) {
    if (typeof np.text !== 'undefined' && np.visible === true) {
      let text
      switch (np.text) {
        case 'congrats':
          text = <p>Congratulations!<br />You have successfully registered.</p>
          break
        case 'firstprofile':
          text = <p>We already started a profile for you based on<br />your uPort profile. You can add more to your<br />profile to give people more information about<br />you and what you like.</p>
          break
        case 'Initiator':
        case 'Finder':
        case 'Planner':
        case 'Doer':
        case 'Validator':
        case 'Resolver':
          text = <p>You have selected the {np.text.toLowerCase()} role.<br />You can see your current role and the other<br />available ones on the dashboard on the left.</p>
          break
        default:
          text = <p>I'm sorry, something seems to be broken in here.</p>
          break
      }
      this.setState({text: text, modalVisible: true})
    }
  }

  handleOk (e) {
    if (typeof this.props.continue !== 'undefined') {
      this.props.continue()
    }
    this.setState({modalVisible: false})
  }

  handleCancel (e) {
    if (typeof this.props.handleCancel !== 'undefined') {
      this.props.handleCancel()
    }
    this.setState({modalVisible: false})
  }

  render () {
    return (
      <Modal
        centered
        visible={this.state.modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button style={{backgroundColor: '#A4D573'}} key='submit' type='primary' onClick={this.handleOk}>
            Continue
          </Button>
        ]}
        maskClosable={false}
      >
        <div style={{fontSize: 14, fontFamily: 'NowAltRegular', textAlign: 'center'}}>
          {this.state.text}
        </div>
      </Modal>
    )
  }
}

export default TextContinue
