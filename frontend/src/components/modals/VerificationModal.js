import React from 'react'
import { Modal, Button } from 'antd'

class VerificationModal extends React.Component {
  constructor () {
    super()
    this.state = {
      modalVisible: false
    }
    this.handleOk = this.handleOk.bind(this)
  }

  componentWillMount () {
    this.setState({modalVisible: this.props.visible})
  }

  handleOk (propType) {
    // this.props.continue(propType)
    this.setState({modalVisible: false})
  }

  render () {
    console.log(this.props)
    return (
      <Modal
        centered
        closable={false}
        visible={this.state.modalVisible}
        footer={null}
        maskClosable={false}
        width={929}
        bodyStyle={{height: 700}}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black'}}>
          <p style={{fontFamily: 'Avenir Next', fontSize: 30, fontWeight: 500, justifyContent: 'center'}}>You are initiating a proposal with the following details:</p>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, minWidth: '100%', border: '1px solid black', marginLeft: 0, marginRight: 0}}>
            <p style={{textAlign: 'center'}}>project name: {this.props.data.name}</p>
            <p style={{textAlign: 'center'}}>project summary: {this.props.data.summary}</p>
            <p style={{textAlign: 'center'}}>project cost: {this.props.data.cost}</p>
            <p style={{textAlign: 'center'}}>project photo: {this.props.data.photo}</p>
            <p style={{textAlign: 'center'}}>project location: {this.props.data.location}</p>
            <p style={{textAlign: 'center'}}>project end data: {this.props.data.stakingEndDate}</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 39}}>
            <p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Avenir Next', fontSize: 25}}>In order to initiate this proposal you are required to<br />contribute:</p>
            <b><p style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Lato', fontSize: 40, marginTop: -20}}>XX,XXX Clout</p></b>
            <div style={{display: 'flex', minWidth: '100%', justifyContent: 'space-evenly', marginTop: -20}}>
              <Button style={{border: '1px solid #989898', borderRadius: 4, color: '#989898', backgroundColor: 'white', maxWidth: 200, height: 55, fontSize: 30, fontFamily: 'Lato', textAlign: 'center'}} key='continueclout' onClick={() => this.handleOk('rep')}>
                <b>Cancel</b>
              </Button>
              <Button style={{border: '1px solid #989898', borderRadius: 4, color: 'white', backgroundColor: '#A4D573', maxWidth: 200, height: 55, fontSize: 30, fontFamily: 'Lato', textAlign: 'center'}} key='continuemoney' onClick={() => this.handleOk('tokens')}>
                Initiate
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default VerificationModal
