import React from 'react'
import { Modal } from 'antd'
import RoleIntroIcon from './RoleIntroIcon'
import initiator from 'images/roleselection/initiator.svg'
import finder from 'images/roleselection/finder.svg'
import planner from 'images/roleselection/planner.svg'
import doer from 'images/roleselection/doer.svg'
import validator from 'images/roleselection/validator.svg'
import resolver from 'images/roleselection/resolver.svg'

class RoleIntro extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: props.visible
    }
    this.clickedRole = this.clickedRole.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  clickedRole (role) {
    this.props.indicateRole(role)
    this.setState({ modalVisible: false })
  }

  handleCancel () {
    this.setState({ modalVisible: false })
    this.props.handleCancel()
  }

  render () {
    return (
      <Modal
        centered
        width={841}
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        visible={this.state.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
        maskClosable={false}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', color: 'white', fontSize: 18, fontFamily: 'Avenir Next', textAlign: 'center' }}>
          <p style={{ margin: 20 }}>On the distribute network there are 6 roles. Each role has a specific task they<br />complete to help further the purpose of the distribute network. The roles are<br />Initiators, Discoverers, Planners, Doers, Validators, and Resolvers.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap', paddingLeft: 40, paddingRight: 40, marginTop: 40 }} >
          <RoleIntroIcon roleName={'INITIATE'} roleIcon={initiator} roleDescription={'Spark the Ideas'} onClick={() => this.clickedRole('initiate')} />
          <RoleIntroIcon roleName={'SUPPORT'} roleIcon={finder} roleDescription={'Quest for the Best'} onClick={() => this.clickedRole('find')} />
          <RoleIntroIcon roleName={'PLAN'} roleIcon={planner} roleDescription={'How Should It Be Done'} onClick={() => this.clickedRole('plan')} />
          <RoleIntroIcon roleName={'DO'} roleIcon={doer} roleDescription={'Makers Welcome'} onClick={() => this.clickedRole('do')} />
          <RoleIntroIcon roleName={'VALIDATE'} roleIcon={validator} roleDescription={'Protect the Network'} onClick={() => this.clickedRole('validate')} />
          <RoleIntroIcon roleName={'RESOLVE'} roleIcon={resolver} roleDescription={'Find the Solution'} onClick={() => this.clickedRole('resolve')} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: 15, paddingRight: 15 }}>
          <p style={{ fontFamily: 'Avenir Next', color: '#989898', fontSize: 14 }}>You will select one role now, but you are able to switch roles any time.</p>
        </div>
      </Modal>
    )
  }
}

export default RoleIntro
