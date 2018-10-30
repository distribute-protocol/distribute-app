import React from 'react'
import { Modal, Button } from 'antd'

class TextContinueModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false
    }
    this.showModal = this.showModal.bind(this)
    this.handleOk = this.handleOk.bind(this)
  }

  componentWillReceiveProps (np) {
    if (typeof np.text !== 'undefined' && np.visible === true) {
      let text
      switch (np.text) {
        case 'congrats':
          text = <p>Congratulations!<br />You have successfully registered.</p>
          break
        default:
          text = <p>I'm sorry, something seems to be broken in here.</p>
          break
      }
      this.setState({text: text, modalVisible: true})
    }
  }

  showModal () {
    this.setState({modalVisible: true})
  }

  handleOk (e) {
    if (typeof this.props.continue !== 'undefined') {
      this.props.continue()
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
      >
        <div style={{fontSize: 14, fontFamily: 'NowAltRegular', textAlign: 'center'}}>
          {this.state.text}
        </div>
      </Modal>
    )
  }
}

export default TextContinueModal
