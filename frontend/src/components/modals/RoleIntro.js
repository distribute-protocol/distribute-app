import React from 'react'
import { Modal } from 'antd'
import RoleIntroIcon from './RoleIntroIcon'
import initiator from '../../images/roleselection/initiator.svg'
import finder from '../../images/roleselection/finder.svg'
import planner from '../../images/roleselection/planner.svg'
import doer from '../../images/roleselection/doer.svg'
import validator from '../../images/roleselection/validator.svg'
import resolver from '../../images/roleselection/resolver.svg'

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
        bodyStyle={{ height: 600, padding: 0 }}
        visible={this.state.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
        maskClosable={false}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140, backgroundColor: 'black', color: 'white', fontSize: 18, fontFamily: 'Avenir Next', textAlign: 'center' }}>
          <p style={{ marginTop: 5 }}>On the distribute network there are 6 roles. Each role has a specific task they<br />complete to help further the purpose of the distribute network. The roles are<br />Initiators, Discoverers, Planners, Doers, Validators, and Resolvers.</p>
        </div>
        <div style={{ display: 'flex', height: 440, justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', paddingLeft: 40, paddingRight: 40 }} >
          <RoleIntroIcon roleName={'INITIATOR'} roleIcon={initiator} roleDescription={'Spark the Ideas'} onClick={() => this.clickedRole('Initiator')} />
          <RoleIntroIcon roleName={'FINDER'} roleIcon={finder} roleDescription={'Quest for the Best'} onClick={() => this.clickedRole('Finder')} />
          <RoleIntroIcon roleName={'PLANNER'} roleIcon={planner} roleDescription={'How Should It Be Done'} onClick={() => this.clickedRole('Planner')} />
          <RoleIntroIcon roleName={'DOER'} roleIcon={doer} roleDescription={'Makers Welcome'} onClick={() => this.clickedRole('Doer')} />
          <RoleIntroIcon roleName={'VALIDATOR'} roleIcon={validator} roleDescription={'Protect the Network'} onClick={() => this.clickedRole('Validator')} />
          <RoleIntroIcon roleName={'RESOLVER'} roleIcon={resolver} roleDescription={'Find the Solution'} onClick={() => this.clickedRole('Resolver')} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -18 }}>
          <p style={{ fontFamily: 'Avenir Next', color: '#989898', fontSize: 14 }}>You will select one role now, but you are able to switch roles any time.</p>
        </div>
      </Modal>
    )
  }
}

export default RoleIntro
