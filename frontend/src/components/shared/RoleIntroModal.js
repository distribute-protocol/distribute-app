import React from 'react'
import { Modal } from 'antd'
import RoleIntroModalIcon from './RoleIntroModalIcon'
import initiator from '../../images/roleselection/initiator.svg'
import finder from '../../images/roleselection/finder.svg'
import planner from '../../images/roleselection/planner.svg'
import doer from '../../images/roleselection/doer.svg'
import validator from '../../images/roleselection/validator.svg'
import resolver from '../../images/roleselection/resolver.svg'

class RoseIntroModal extends React.Component {
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
    if (np.visible === true) {
    //   let text
    //   switch (np.text) {
    //     case 'congrats':
    //       text = <p>Congratulations!<br />You have successfully registered.</p>
    //       break
    //     case 'firstprofile':
    //       text = <p>We already started a profile for you based on<br />your uPort profile. You can add more to your<br />profile to give people more information about<br />you and what you like.</p>
    //       break
    //     default:
    //       text = <p>I'm sorry, something seems to be broken in here.</p>
    //       break
    //   }
      this.setState({modalVisible: true})
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

  handleCancel (e) {
    this.setState({modalVisible: false})
  }

  render () {
    return (
      <Modal
        centered
        width={841}
        bodyStyle={{height: 600, padding: 0}}
        visible={this.state.modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140, backgroundColor: 'black', color: 'white', fontSize: 18, fontFamily: 'Avenir Next', textAlign: 'center'}}>
          <p style={{marginTop: 5}}>On the distribute network there are 6 roles. Each role has a specific task they<br />complete to help further the purpose of the distribute network. The roles are<br />Initiators, Discoverers, Planners, Doers, Validators, and Resolvers.</p>
        </div>
        <div style={{display: 'flex', height: 440, justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', paddingLeft: 40, paddingRight: 40}}>
          <RoleIntroModalIcon roleName={'INTIATOR'} roleIcon={initiator} roleDescription={'Spark the Ideas'} />
          <RoleIntroModalIcon roleName={'FINDER'} roleIcon={finder} roleDescription={'Quest for the Best'} />
          <RoleIntroModalIcon roleName={'PLANNER'} roleIcon={planner} roleDescription={'How Should It Be Done'} />
          <RoleIntroModalIcon roleName={'DOER'} roleIcon={doer} roleDescription={'Makers Welcome'} />
          <RoleIntroModalIcon roleName={'VALIDATOR'} roleIcon={validator} roleDescription={'Protect the Network'} />
          <RoleIntroModalIcon roleName={'RESOLVER'} roleIcon={resolver} roleDescription={'Find the Solution'} />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: -18}}>
          <p style={{fontFamily: 'Avenir Next', color: '#989898', fontSize: 14}}>You will select one role now, but you are able to switch roles any time.</p>
        </div>
      </Modal>
    )
  }
}

export default RoseIntroModal
