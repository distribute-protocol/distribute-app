import React from 'react'
import { Modal, Button } from 'antd'
import txpending from '../../images/tximages/txpending.svg'
import cancel from '../../images/tximages/cancel.svg'

class VerificationModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false,
      txState: 'verification'
    }
    // this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.initiate = this.initiate.bind(this)
  }

  componentWillMount () {
    this.setState({modalVisible: this.props.visible})
  }

  // handleOk (propType) {
  //   // this.props.continue(propType)
  //   this.setState({modalVisible: false})
  // }

  handleCancel () {
    this.setState({modalVisible: false})
  }

  initiate () {
    this.props.propose()
    this.setState({txState: 'pending'})
  }

  render () {
    let topText, bottomText
    switch (this.state.txState) {
      case 'verification':
        topText = <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black'}}><p style={{fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center'}}>You are initiating a proposal with the following details:</p></div>
        bottomText = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 39}}>
          <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Avenir Next', fontSize: 25}}>In order to initiate this proposal you are required to<br />contribute:</p>
          <b><p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 40, marginTop: -20}}>XX,XXX Clout</p></b>
          <div style={{display: 'flex', minWidth: '100%', justifyContent: 'space-evenly', marginTop: -20}}>
            <Button style={{borderRadius: 4, color: '#989898', backgroundColor: 'white', maxWidth: 200, height: 55, fontSize: 30, fontFamily: 'Lato', textAlign: 'center'}} key='continueclout' onClick={this.handleCancel}>
              <b>Cancel</b>
            </Button>
            <Button style={{borderRadius: 4, color: 'white', backgroundColor: '#A4D573', maxWidth: 200, height: 55, fontSize: 30, fontFamily: 'Lato', textAlign: 'center'}} key='continuemoney' onClick={this.initiate}>
              Initiate
            </Button>
          </div>
        </div>
        break
      case 'pending':
        topText = <div style={{display: 'flex', justifyContent: 'space-around', color: 'black'}}><img style={{cursor: 'pointer'}} src={cancel} alt={cancel} /><p style={{marginTop: 15, fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center'}}>You are initiating a proposal with the following details:</p></div>
        bottomText = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 39}}>
          <b><p style={{textAlign: 'center', fontFamily: 'Lato', fontSize: 24}}>Transaction Pending</p></b>
          <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 18, marginTop: -20}}>The average rate that the ethereum blockchain adds blocks is 15 seconds.<br />Block time differs between chains with some blockchains such as bitcoin taking<br />10 minutes to add blocks.</p>
          <img style={{justifyContent: 'center'}} src={txpending} alt={txpending} />
        </div>
        break
    }
    return (
      <Modal
        centered
        closable={false}
        visible={this.state.modalVisible}
        footer={null}
        maskClosable={false}
        width={929}
        bodyStyle={{height: 600}}
      >
        {topText}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', minHeight: 150, minWidth: '100%', border: '1px solid black', marginLeft: 0, marginRight: 0}}>
          <p style={{textAlign: 'center'}}>project name: {this.props.data.name}</p>
          <p style={{textAlign: 'center'}}>project summary: {this.props.data.summary}</p>
          <p style={{textAlign: 'center'}}>project cost: {this.props.data.cost}</p>
          <p style={{textAlign: 'center'}}>project photo: {this.props.data.photo}</p>
          <p style={{textAlign: 'center'}}>project location: {this.props.data.location}</p>
          <p style={{textAlign: 'center'}}>project end data: {this.props.data.stakingEndDate}</p>
        </div>
        {bottomText}
      </Modal>
    )
  }
}

export default VerificationModal
