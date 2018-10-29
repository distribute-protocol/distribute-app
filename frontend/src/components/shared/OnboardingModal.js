import React from 'react'
import { Modal, Button } from 'antd'
import uportlogo from '../../images/uportlogo.svg'

class OnboardingModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false
    }
    this.showModal = this.showModal.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentWillReceiveProps (np) {
    if (typeof np.hasEther !== 'undefined' && np.clickedJoin !== 'undefined') {
      this.setState({modalVisible: !np.hasEther && np.clickedJoin})
    }
  }

  showModal () {
    this.setState({modalVisible: true})
  }

  handleOk (e) {
    this.setState({modalVisible: false})
  }

  handleCancel (e) {
    this.setState({modalVisible: false})
  }

  render () {
    return (
      <Modal
        visible={this.state.modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key='back' onClick={this.handleCancel}>Back</Button>,
          <Button key='submit' type='primary' onClick={this.handleOk}>
            Continue
          </Button>
        ]}
      >
        <p>It looks like you don't have any ether, the currency of the ethereum blockchain. You can fund your account with the following providers:</p>
        <img src={uportlogo} alt='uPort logo' />
        <img src={uportlogo} alt='uPort logo' />
        <p>Some other text</p>
      </Modal>
    )
  }
}

export default OnboardingModal
