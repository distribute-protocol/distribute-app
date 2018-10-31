import React from 'react'
import { Modal } from 'antd'
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
          <p>On the distribute network there are 6 roles. Each role has a specific task they<br />complete to help further the purpose of the distribute network. The roles are<br />Initiators, Discoverers, Planners, Doers, Validators, and Resolvers.</p>
        </div>
        <div style={{display: 'flex', height: 440, justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', paddingLeft: 40, paddingRight: 40}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%'}}>
            <img style={{justifyContent: 'center'}} src={initiator} alt='initiator' />
            <p style={{fontFamily: 'Roboto', fontSize: 18}}>INITIATOR</p>
            <p style={{fontFamily: 'NowAltRegular', fontSize: 14, marginTop: -20}}>Spark the Ideas</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%'}}>
            <img style={{justifyContent: 'center'}} src={finder} alt='finder' />
            <p style={{fontFamily: 'Roboto', fontSize: 18}}>FINDER</p>
            <p style={{fontFamily: 'NowAltRegular', fontSize: 14, marginTop: -20}}>Quest for the Best</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%'}}>
            <img style={{justifyContent: 'center'}} src={planner} alt='planner' />
            <p style={{fontFamily: 'Roboto', fontSize: 18}}>PLANNER</p>
            <p style={{fontFamily: 'NowAltRegular', fontSize: 14, marginTop: -20}}>How Should It Be Done</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%'}}>
            <img style={{justifyContent: 'center'}} src={doer} alt='doer' />
            <p style={{fontFamily: 'Roboto', fontSize: 18}}>DOER</p>
            <p style={{fontFamily: 'NowAltRegular', fontSize: 14, marginTop: -20}}>Makers Welcome</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%'}}>
            <img style={{justifyContent: 'center'}} src={validator} alt='validator' />
            <p style={{fontFamily: 'Roboto', fontSize: 18}}>VALIDATOR</p>
            <p style={{fontFamily: 'NowAltRegular', fontSize: 14, marginTop: -20}}>Protect the Network</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 30%'}}>
            <img style={{justifyContent: 'center'}} src={resolver} alt='resolver' />
            <p style={{fontFamily: 'Roboto', fontSize: 18}}>RESOLVER</p>
            <p style={{fontFamily: 'NowAltRegular', fontSize: 14, marginTop: -20}}>Find the Solution</p>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: -18}}>
          <p style={{fontFamily: 'Avenir Next', color: '#989898', fontSize: 14}}>You will select one role now, but you are able to switch roles any time.</p>
        </div>
      </Modal>
    )
  }
}

export default RoseIntroModal
