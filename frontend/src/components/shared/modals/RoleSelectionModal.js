import React from 'react'
import { Modal, Button } from 'antd'

class RoleSelectionModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentWillReceiveProps (np) {
    if (np.visible === true && typeof np.role !== 'undefined') {
      let text, color
      switch (np.role) {
        case 'Initiator':
          text = <p>Initiators are the spark of the distribute network. They spark the ideas that become the projects and<br />initiatives for the commons. They are invited to be creative in addition to being practical. When an initiator<br />wants to submit an idea to the network they contribute some of their own stake to help it grow.<br />What will you help start today?</p>
          color = '#FFC161'
          break
        case 'Finder':
          text = <p>Finders are tasked with finding the best ideas that the network should support. They use their own tokens<br />and reputation to support projects, calling attention to the ways they will support the network.<br />What will you discover today?</p>
          color = '#FF8E6F'
          break
        case 'Planner':
          text = <p>Planners are responsible for describing how everything should be built. They use their creativity and<br />practicality to create the best possible path for achieving and idea. If a good plan exists already, they can<br />use their influence to boost other plans to the top.<br />What will you help build?</p>
          color = '#E36983'
          break
        case 'Doer':
          text = <p>Doers are the people that bring the ideas to life. They contribute their labor to the projects. When a doer<br />wants to work, they will claim a task and complete it. Once it’s compeleted it is validated by a defender.<br />What will you contribute today?</p>
          color = '#A85490'
          break
        case 'Validator':
          text = <p>Initiators are the spark of the distribute network. They spark the ideas that become the projects and<br />initiatives for the commons. They are invited to be creative in addition to being practical. When an initiator<br />wants to submit an idea to the network they contribute some of their own stake to help it grow.<br />What will you help start today?</p>
          color = '#5E498A'
          break
        case 'Resolver':
          text = <p>Defenders are the protectors of network value. They validate the work that has been done on projects and<br />confirm that it has been completed sufficiently. They are required to stake some of their own tokens to<br />complete a validation, and receive a reward if they are deemed correct.<br />Will you help us protect the network today?</p>
          color = '#6194D1'
          break
        default:
          text = <p>I'm sorry, something seems to be broken in here.</p>
          color = 'red'
          break
      }
      this.setState({modalVisible: true, color: color, text: text, role: np.role})
    }
  }

  handleOk (e) {
    this.props.selectRole()
    this.setState({modalVisible: false})
  }

  handleCancel (e) {
    this.setState({modalVisible: false})
    this.props.handleCancel()
  }

  render () {
    return (
      <Modal
        centered
        width={841}
        bodyStyle={{height: 500, padding: 0}}
        visible={this.state.modalVisible}
        onOk={null}
        onCancel={this.handleCancel}
        footer={null}
        maskClosable={false}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140, backgroundColor: this.state.color, color: 'white', fontSize: 16, fontFamily: 'Avenir Next', textAlign: 'center'}}>
          {this.state.text}
        </div>
        <div style={{display: 'flex', height: 340, alignItems: 'flex-end', justifyContent: 'center'}}>
          <Button style={{backgroundColor: this.state.color, color: 'white'}} key='back' onClick={this.handleOk}>Select {this.state.role}</Button>
        </div>
      </Modal>
    )
  }
}

export default RoleSelectionModal
