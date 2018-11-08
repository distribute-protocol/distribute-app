import React from 'react'
import { Button, Form, Input, DatePicker, Upload, Icon, Dropdown, Menu } from 'antd'
import grayx from '../images/grayplus.svg'
const { TextArea } = Input
const FormItem = Form.Item

class ProposeForm extends React.Component {
  constructor () {
    super()
    this.state = {
      collateralType: ''
    }
    this.submitHandler = this.submitHandler.bind(this)
  }

  // let {
  //   handlePhotoChange,
  //   imageUrl,
  //   cost,
  //   reputationCost,
  //   loading,
  //   handlePriceChange,
  //   handleLocationChange,
  //   proposeProject,
  //   map
  // } = props

  submitHandler (type) {
    this.props.proposeProject(type, this.props.form.getFieldsValue())
    this.props.form.resetFields()
  }

  chooseCollateral (type) {
    this.setState({collateralType: type})
  }

  render () {
    const uploadButton = (
      <div>
        {this.props.loading
          ? (<Icon type={'loading'} />)
          : (<div>
            <Icon type={'plus'} />
            <div className='ant-upload-text'>Upload</div>
          </div>)
        }
      </div>
    )
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.chooseCollateral('Tokens')} target='_blank' rel='noopener noreferrer'>Tokens</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.chooseCollateral('Reputation')} target='_blank' rel='noopener noreferrer'>Reputation</a>
        </Menu.Item>
      </Menu>
    )
    const { getFieldDecorator } = this.props.form

    return (
      <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 150, backgroundColor: 'rgba(218, 218, 218, 0.5)', color: 'black'}}>
        <b><p style={{paddingTop: 20, textAlign: 'center', fontFamily: 'Lato', fontSize: 36}}>Initiating a Proposal</p></b>
        <p style={{paddingTop: 20, textAlign: 'center', fontFamily: 'Lato', fontSize: 20}}>In order to create a node proposal you will need to stake 5% of the project cost in tokens or reputation.<br />If the project proposal is successful, you will receive 1% of the project cost in ether as a reward.</p>
        <div style={{marginTop: 20, marginBottom: 40, backgroundColor: 'white', border: '1px solid #989898', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '15%', marginRight: '15%'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 40, backgroundColor: '#FAFBFB', border: '1px solid #989898', marginLeft: '10%', marginRight: '10%'}}>
            <div style={{marginLeft: 15, marginTop: 20}}>
              <b><p style={{fontFamily: 'Lato', fontSize: 20}}>Project Image:</p></b>
              <p style={{fontFamily: 'Lato', fontSize: 14}}>Adding a picture of where the<br />mesh node should go helps<br />people understand what you<br />want to build.</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(218, 218, 218, 0.5)', border: '1px solid #989898', marginTop: 20, marginLeft: 20, marginBottom: 20, marginRight: 50, paddingLeft: '15%', paddingRight: '15%', paddingTop: '10%', paddingBottom: '10%'}}>
              <img src={grayx} alt='gray x' />
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, backgroundColor: '#FAFBFB', border: '1px solid #989898', marginLeft: '10%', marginRight: '10%'}}>
            <div style={{marginLeft: 15, marginTop: 20}}>
              <b><p style={{fontFamily: 'Lato', fontSize: 20}}>Project Name:</p></b>
              <p style={{fontFamily: 'Lato', fontSize: 14}}>Let's give your project a name<br />so that people can easily find it.</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 50, paddingLeft: '15%', paddingTop: '5%', paddingBottom: '5%'}}>
              <Input style={{width: 350}} placeholder={null} />
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, backgroundColor: '#FAFBFB', border: '1px solid #989898', marginLeft: '10%', marginRight: '10%'}}>
            <div style={{marginLeft: 15, marginTop: 20}}>
              <b><p style={{fontFamily: 'Lato', fontSize: 20}}>Project Description:</p></b>
              <p style={{fontFamily: 'Lato', fontSize: 14}}>Tell people what you're trying to<br />build. Focus on what you're<br />making.</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 50, paddingLeft: '15%', paddingTop: '7%', paddingBottom: '4%'}}>
              <TextArea style={{width: 350}} rows={10} />
            </div>
          </div>
          <div style={{marginTop: 20, backgroundColor: '#FAFBFB', border: '1px solid #989898', marginLeft: '10%', marginRight: '10%'}}>
            <div style={{marginLeft: 15, marginTop: 20}}>
              <b><p style={{fontFamily: 'Lato', fontSize: 20}}>Project Location:</p></b>
              <p style={{fontFamily: 'Lato', fontSize: 14}}>Let's mark the location on a map<br />so people know where you're<br />trying to build the node.</p>
            </div>
            <div>
              {this.props.map}
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, backgroundColor: '#FAFBFB', border: '1px solid #989898', marginLeft: '10%', marginRight: '10%'}}>
            <div style={{marginLeft: 15, marginTop: 20}}>
              <b><p style={{fontFamily: 'Lato', fontSize: 20}}>Project Duration:</p></b>
              <p style={{fontFamily: 'Lato', fontSize: 14}}>How long do you want the<br />proposal to be open.</p>
              <p style={{fontFamily: 'Lato', fontSize: 10}}>Note: If the proposal is not funded by the<br />proposal end date, you will lose your staked<br />tokens or reputation.</p>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, backgroundColor: '#FAFBFB', border: '1px solid #989898', marginLeft: '10%', marginRight: '10%'}}>
            <div style={{marginLeft: 15, marginTop: 20}}>
              <b><p style={{fontFamily: 'Lato', fontSize: 20}}>Project Cost:</p></b>
              <p style={{fontFamily: 'Lato', fontSize: 14}}>How much will this project cost?</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 50, paddingLeft: '15%', paddingTop: '5%', paddingBottom: '5%'}}>
              <Input style={{width: 350}} placeholder={null} />
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, backgroundColor: '#FAFBFB', border: '1px solid #989898', marginLeft: '10%', marginRight: '10%'}}>
            <div style={{marginLeft: 15, marginTop: 20}}>
              <b><p style={{fontFamily: 'Lato', fontSize: 20}}>Collateral Type:</p></b>
              <p style={{fontFamily: 'Lato', fontSize: 14}}>Would you like to stake tokens<br />or clout to create this<br />proposal?</p>
            </div>
            <div style={{marginTop: '5%', marginBottom: '5%', marginRight: '5%'}}>
              <Dropdown overlay={menu}>
                <Button style={{ width: 350, border: '1px solid #989898', textAlign: 'left' }}>
                  <Icon type='down' /> { this.state.collateralType === '' ? null : this.state.collateralType }
                </Button>
              </Dropdown>
              { this.state.collateralType === '' ? null : <p style={{paddingLeft: 30, paddingTop: 15}}>You will need to contribute amount {this.state.collateralType.toLowerCase()}.</p> }
            </div>
          </div>
          <div style={{display: 'flex', marginTop: 40, marginBottom: 40, justifyContent: 'center', alignItems: 'center', marginLeft: '15%', marginRight: '15%'}}>
            <Button style={{textAlign: 'center', backgroundColor: '#A4D573', borderRadius: 4, color: 'white', height: 46, fontFamily: 'Lato', fontSize: 24}}>
              Create Proposal
            </Button>
          </div>
        </div>
      </div>

       /* <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: 100, justifyContent: 'center', marginBottom: 100}}>
          <header className='App-header'>
            <h3 className='App-title2'>Propose Project</h3>
          </header>
          <div style={{display: 'flex', flexDirection: 'column', marginRight: 200}}>
            <Form layout='horizontal'>
              <FormItem label='Name'>
                {getFieldDecorator('name')(<Input placeholder='Project Name' />)}
              </FormItem>
              <FormItem label='Photo'>
                <Upload
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  // action='//jsonplaceholder.typicode.com/posts/'
                  // beforeUpload={beforeUpload}
                  onChange={handlePhotoChange}
                >
                  {imageUrl
                    ? <img style={{width: 200, height: 200}} src={imageUrl} alt='' />
                    : uploadButton}
                </Upload>
              </FormItem>
              <FormItem label='Summary'>
                {getFieldDecorator('summary')(<TextArea rows={4} type='textarea' placeholder='Project Summary' />)}
              </FormItem>
              <FormItem label='Location'>
                {getFieldDecorator('location')(<Input placeholder='Project Location' onChange={handleLocationChange} />)}
              </FormItem>
              {map}
              <FormItem label='Cost'>
                {getFieldDecorator('cost')(<Input placeholder='ETH' type='number' onChange={handlePriceChange} />)}
              </FormItem>
              <FormItem label='Staking End Date'>
                {getFieldDecorator('date')(<DatePicker />)}
              </FormItem>
              <div style={{marginTop: 20}}>
                <h4>{`You have to deposit ${cost} tokens`}</h4>
              </div>
              <div style={{marginTop: 20}}>
                <h4>{`You have to deposit ${reputationCost} reputation`}</h4>
              </div>
              <div style={{marginTop: 20}}>
                <Button type='info' onClick={() => submitHandler('tokens')} style={{marginLeft: 10}}>
                  Propose Project (Tokens)
                </Button>
              </div>
              <div style={{marginTop: 20}}>
                <Button type='info' onClick={() => submitHandler('reputation')} style={{marginLeft: 10}}>
                  Propose Project (Reputation)
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div> */
    )
  }
}

export default Form.create()(ProposeForm)
