import React from 'react'
import { Modal, Button } from 'antd'
import InitiatorGroup from 'images/roleselection/InitiatorGroup.png'
import FinderGroup from 'images/roleselection/FinderGroup.png'
import PlannerGroup from 'images/roleselection/PlannerGroup.png'
import DoerGroup from 'images/roleselection/DoerGroup.png'
import ValidatorGroup from 'images/roleselection/ValidatorGroup.png'
import ResolverGroup from 'images/roleselection/ResolverGroup.png'
import closeButton from 'images/ButtonClose.png'

class RoleSelectionModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentWillMount () {
    if (this.props.visible === true && typeof this.props.role !== 'undefined') {
      let text, color, img
      switch (this.props.role) {
        case 'Initiator':
          text = <p>Initiators are the spark of the distribute network. They spark the ideas that become the projects and<br />initiatives for the commons. They are invited to be creative in addition to being practical. When an initiator<br />wants to submit an idea to the network they contribute some of their own stake to help it grow.<br />What will you help start today?</p>
          color = '#FFC161'
          img = InitiatorGroup
          break
        case 'Finder':
          text = <p>Finders are tasked with finding the best ideas that the network should support. They use their own tokens<br />and reputation to support projects, calling attention to the ways they will support the network.<br />What will you discover today?</p>
          color = '#FF8E6F'
          img = FinderGroup
          break
        case 'Planner':
          text = <p>Planners are responsible for describing how everything should be built. They use their creativity and<br />practicality to create the best possible path for achieving and idea. If a good plan exists already, they can<br />use their influence to boost other plans to the top.<br />What will you help build?</p>
          color = '#E36983'
          img = PlannerGroup
          break
        case 'Doer':
          text = <p>Doers are the people that bring the ideas to life. They contribute their labor to the projects. When a doer<br />wants to work, they will claim a task and complete it. Once it’s compeleted it is validated by a defender.<br />What will you contribute today?</p>
          color = '#A85490'
          img = DoerGroup
          break
        case 'Validator':
          text = <p>Validators are the protectors of network value. They validate the work that has been done on projects and<br />confirm that it has been completed sufficiently. They are required to stake some of their own tokens to<br />complete a validation, and receive a reward if they are deemed correct.<br />Will you help us protect the network today?</p>
          color = '#5E498A'
          img = ValidatorGroup
          break
        case 'Resolver':
          text = <p>Resolvers solve disputes. They parse through the evidence presented and vote on the correct outcome.<br />They rally other resolvers around their decisions in order to reach the correct resolution, thereby making sure everyone who deserves to be paid is paid. <br />What will you help resolve today?</p>
          color = '#6194D1'
          img = ResolverGroup
          break
        default:
          text = <p>I'm sorry, something seems to be broken in here.</p>
          color = 'red'
          break
      }
      this.setState({ modalVisible: true, color, text, img, role: this.props.role })
    }
  }

  handleOk (e) {
    this.props.selectRole()
    this.setState({ modalVisible: false })
  }

  handleCancel (e) {
    this.setState({ modalVisible: false })
    this.props.handleCancel()
  }

  render () {
    return (
      <Modal
        centered
        width={841}
        bodyStyle={{ height: 565, padding: 0 }}
        visible={this.state.modalVisible}
        onOk={null}
        onCancel={this.handleCancel}
        footer={null}
        maskClosable={false}
        closable={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 170, backgroundColor: this.state.color, color: 'white', fontSize: 16, fontFamily: 'Avenir Next', textAlign: 'center' }}>
          <img src={closeButton} style={{ alignSelf: 'flex-start', marginLeft: 15, marginTop: 15, marginBottom: 15 }} onClick={this.handleCancel} />
          {this.state.text}
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={this.state.img} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <Button style={{ backgroundColor: this.state.color, color: 'white', height: 60, width: 165, fontSize: 20 }} key='back' onClick={this.handleOk}>{'Select ' + this.state.role}</Button>
        </div>
      </Modal>
    )
  }
}

export default RoleSelectionModal
