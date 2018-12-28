import React from 'react'
import { Button, Form, Input, DatePicker, Upload, Icon, Dropdown, Menu } from 'antd'
import mapboxgl from 'mapbox-gl'
import MapboxClient from 'mapbox/lib/services/geocoding'
import grayx from '../../images/grayplus.svg'
const { TextArea } = Input
const FormItem = Form.Item

const client = new MapboxClient('pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA')
mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA'
const WAIT_INTERVAL = 1500

const styles = {
  header: {
    fontFamily: 'Lato',
    fontSize: 20
  },
  subheader: {
    fontFamily: 'Lato',
    fontSize: 14
  },
  text: {
    fontFamily: 'Lato',
    fontSize: 10
  }
}
class ProposeForm extends React.Component {
  constructor () {
    super()
    this.state = {
      collateralType: '',
      category: ''
    }
    this.submitHandler = this.submitHandler.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.triggerMapChange = this.triggerMapChange.bind(this)
  }

  componentDidMount () {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v10'
    })
    this.setState({ map: map })
    let coordHandler = (pos) => {
      let ll = new mapboxgl.LngLat(pos.coords.longitude, pos.coords.latitude)
      map.setCenter(ll)
      map.setZoom(12)
      map.addControl(new mapboxgl.NavigationControl())
      map.on('click', (e) => {
        map.setCenter(e.lngLat)
        this.setState({ coords: e.lngLat })
      })
    }
    window.navigator.geolocation.getCurrentPosition(coordHandler)
  }

  componentWillUnmount () {
    this.state.map.remove()
  }

  handleLocationChange (val) {
    clearTimeout(this.timer)
    this.setState({ location: val.target.value })
    this.timer = setTimeout(this.triggerMapChange, WAIT_INTERVAL)
  }

  triggerMapChange () {
    const { location } = this.state
    client.geocodeForward(location, (err, data, res) => {
      if (err) { console.error(err) }
      this.state.map.setCenter(data.features[0].geometry.coordinates)
      this.state.map.setZoom(18)
      new mapboxgl.Marker()
        .setLngLat(data.features[0].geometry.coordinates)
        .addTo(this.state.map)
      this.setState({ coords: data.features[0].geometry.coordinates })
    })
  }

  submitHandler (type) {
    this.props.storeData(type, this.props.form.getFieldsValue(), this.state.category)
    this.props.form.resetFields()
  }

  render () {
    const collateralMenu = (
      <Menu>
        <Menu.Item>
          <p onClick={() => this.setState({ collateralType: 'Tokens' })} target='_blank' rel='noopener noreferrer'>Tokens</p>
        </Menu.Item>
        <Menu.Item>
          <p onClick={() => this.setState({ collateralType: 'Reputation' })} target='_blank' rel='noopener noreferrer'>Reputation</p>
        </Menu.Item>
      </Menu>
    )

    const categoryMenu = (
      <Menu>
        <Menu.Item>
          <p onClick={() => this.setState({ category: 'community mesh networks' })} target='_blank' rel='noopener noreferrer'>community mesh networks</p>
        </Menu.Item>
        <Menu.Item>
          <p onClick={() => this.setState({ category: 'urban agriculture' })} target='_blank' rel='noopener noreferrer'>urban agriculture</p>
        </Menu.Item>
        <Menu.Item>
          <p onClick={() => this.setState({ category: 'land trusts' })} target='_blank' rel='noopener noreferrer'>land trusts</p>
        </Menu.Item>
        <Menu.Item>
          <p onClick={() => this.setState({ category: 'sustainable energy systems' })} target='_blank' rel='noopener noreferrer'>sustainable energy systems</p>
        </Menu.Item>
        <Menu.Item>
          <p onClick={() => this.setState({ category: 'open source software' })} target='_blank' rel='noopener noreferrer'>open source software</p>
        </Menu.Item>
        <Menu.Item>
          <p onClick={() => this.setState({ category: 'other' })} target='_blank' rel='noopener noreferrer'>other</p>
        </Menu.Item>
      </Menu>
    )
    const { getFieldDecorator } = this.props.form

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 100,
        backgroundColor: 'rgba(218, 218, 218, 0.5)',
        color: 'black'
      }}>
        <b><p style={{
          paddingTop: 20,
          textAlign: 'center',
          fontFamily: 'Lato',
          fontSize: 36
        }}>Initiating a Proposal</p></b>
        <p style={{
          paddingTop: 20,
          textAlign: 'center',
          fontFamily: 'Lato',
          fontSize: 20
        }}>
          In order to create a node proposal you will need to stake 5% of the project cost in tokens or reputation.<br />
          If the project proposal is successful, you will receive 1% of the project cost in ether as a reward.
        </p>
        <Form layout='horizontal'>
          <div style={{
            marginTop: 20,
            marginBottom: 40,
            backgroundColor: 'white',
            border: '1px solid #989898',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: '15%',
            marginRight: '15%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 40,
              backgroundColor: '#FAFBFB',
              border: '1px solid #989898',
              marginLeft: '10%',
              marginRight: '10%'
            }}>
              <div style={{ marginLeft: 15, marginTop: 20 }}>
                <b><p style={styles.header}>Project Name:</p></b>
                <p style={styles.subheader}>
                  Let's give your project a name<br />
                  so that people can easily find it.
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 50,
                paddingLeft: '15%',
                paddingTop: '5%',
                paddingBottom: '5%'
              }}>
                <FormItem>
                  {getFieldDecorator('name')(<Input
                    style={{ maxWidth: 350, borderRadius: 0, border: '1px solid #989898' }}
                    placeholder='' />
                  )}
                </FormItem>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20,
              backgroundColor: '#FAFBFB',
              border: '1px solid #989898',
              marginLeft: '10%',
              marginRight: '10%'
            }}>
              <div style={{ marginLeft: 15, marginTop: 20 }}>
                <b>
                  <p style={styles.header}>
                    Project Description:
                  </p>
                </b>
                <p style={styles.subheader}>
                  Tell people what you're trying to<br />
                  build. Focus on what you're<br />
                  making.
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 50,
                paddingLeft: '15%',
                paddingTop: '7%',
                paddingBottom: '4%'
              }}>
                <FormItem>
                  {getFieldDecorator('summary')(<TextArea style={{
                    maxWidth: 350,
                    borderRadius: 0,
                    border: '1px solid #989898'
                  }} rows={10} type='textarea' />)}
                </FormItem>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20,
              backgroundColor: '#FAFBFB',
              border: '1px solid #989898',
              marginLeft: '10%',
              marginRight: '10%'
            }}>
              <div style={{ marginLeft: 15, marginTop: 20 }}>
                <b><p style={styles.header}>Project Category:</p></b>
                <p style={styles.subheader}>
                  Pick a project category to connect with a specific community.<br />
                  You can always update this later.
                </p>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: '5%',
                marginBottom: '5%',
                marginRight: '7%'
              }}>
                {getFieldDecorator('category')(
                  <Dropdown overlay={categoryMenu} style={{ justifyContent: 'flex-end' }}>
                    <Button style={{
                      maxWidth: 350,
                      border: '1px solid #989898',
                      borderRadius: 0,
                      textAlign: 'left'
                    }}>
                      <Icon type='down' /> { this.state.category === '' ? null : this.state.category }
                    </Button>
                  </Dropdown>
                )}
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20,
              backgroundColor: '#FAFBFB',
              border: '1px solid #989898',
              marginLeft: '10%',
              marginRight: '10%'
            }}>
              <div style={{ marginLeft: 15, marginTop: 20 }}>
                <b><p style={styles.header}>Project Duration:</p></b>
                <p style={styles.subheader}>
                  How long do you want the<br />proposal to be open.
                </p>
                <p style={styles.text}>
                  Note: If the proposal is not funded by the<br />
                  proposal end date, you will lose your staked<br />
                  tokens or reputation.
                </p>
              </div>
              <div style={{ marginRight: 50, marginTop: 10 }}>
                <FormItem>
                  {getFieldDecorator('date')(<DatePicker style={{ borderRadius: 0, border: '1px solid #989898' }} />)}
                </FormItem>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20,
              backgroundColor: '#FAFBFB',
              border: '1px solid #989898',
              marginLeft: '10%',
              marginRight: '10%'
            }}>
              <div style={{
                marginLeft: 15,
                marginTop: 20
              }}>
                <b>
                  <p style={styles.header}>
                    Project Cost:
                  </p>
                </b>
                <p style={styles.subheader}>
                  How much will this project cost?
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 50,
                paddingLeft: '15%',
                paddingTop: '5%',
                paddingBottom: '5%'
              }}>
                <FormItem>
                  {getFieldDecorator('cost')(<Input style={{ maxWidth: 350, borderRadius: 0, border: '1px solid #989898' }} placeholder='ETH' type='number' onChange={this.props.handlePriceChange} />)}
                </FormItem>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20,
              backgroundColor: '#FAFBFB',
              border: '1px solid #989898',
              marginLeft: '10%',
              marginRight: '10%'
            }}>
              <div style={{ marginLeft: 15, marginTop: 20 }}>
                <b><p style={styles.header}>
                  Collateral Type:
                </p></b>
                <p style={styles.subheader}>
                  Would you like to stake tokens<br />or clout to create this<br />proposal?
                </p>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: '5%',
                marginBottom: '5%',
                marginRight: '7%'
              }}>
                <Dropdown overlay={collateralMenu} style={{ justifyContent: 'flex-end' }}>
                  <Button style={{
                    maxWidth: 350,
                    border: '1px solid #989898',
                    borderRadius: 0,
                    textAlign: 'left'
                  }}>
                    <Icon type='down' /> { this.state.collateralType === '' ? null : this.state.collateralType }
                  </Button>
                </Dropdown>
                { this.state.collateralType === ''
                  ? null
                  : <p style={{ justifyContent: 'flex-end' }}>
                    You will need to contribute %{this.state.collateralType === 'Tokens' ? this.props.tokensToStake : this.props.repToStake} {this.state.collateralType.toLowerCase()}.
                  </p> }
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20,
              backgroundColor: '#FAFBFB',
              border: '1px solid #989898',
              marginLeft: '10%',
              marginRight: '10%'
            }}>
              <div style={{ marginLeft: 15, marginTop: 20 }}>
                <b><p style={styles.header}>
                  Project Location:
                </p></b>
                <p style={styles.subheader}>
                  Let's mark the location on a map<br />
                  so people know where you're<br />
                  trying to build the node.
                </p>
              </div>
              <div>
                <FormItem style={{ marginBottom: -0, backgroundColor: 'black' }}>
                  {getFieldDecorator('location')(
                    <Input
                      style={{ borderRadius: 0, border: '1px solid #989898' }}
                      placeholder='Enter Address'
                      onChange={this.props.handleLocationChange}
                    />
                  )}
                </FormItem>
                <div id='map' style={{ width: 400, height: 400 }} ref={el => { this.mapContainer = el }} />
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20,
              backgroundColor: '#FAFBFB',
              border: '1px solid #989898',
              marginLeft: '10%',
              marginRight: '10%'
            }}>
              <div style={{ marginLeft: 15, marginTop: 20 }}>
                <b><p style={styles.header}>Project Image:</p></b>
                <p style={styles.subheader}>
                  Adding a picture of where the<br />
                  mesh node should go helps<br />
                  people understand what you<br />
                  want to build.
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(218, 218, 218, 0.5)',
                border: '1px solid #989898',
                margin: 20,
                marginRight: 50,
                paddingLeft: '15%',
                paddingRight: '15%',
                paddingTop: '10%',
                paddingBottom: '10%'
              }}>
                <FormItem>
                  <Upload
                    name='avatar'
                    showUploadList={false}
                    onChange={this.props.handlePhotoChange}
                  >
                    {this.props.imageUrl
                      ? <img style={{ maxWidth: 200, maxHeight: 200 }} src={this.props.imageUrl} alt='' />
                      : <img style={{ cursor: 'pointer' }} src={grayx} alt='gray x' />}
                  </Upload>
                </FormItem>
              </div>
            </div>
            <div style={{
              display: 'flex',
              marginTop: 40,
              marginBottom: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '15%',
              marginRight: '15%'
            }}>
              <Button style={{
                textAlign: 'center',
                backgroundColor: '#A4D573',
                borderRadius: 4,
                color: 'white',
                height: 46,
                fontFamily: 'Lato',
                fontSize: 24
              }} onClick={() => this.submitHandler(this.state.collateralType.toLowerCase())}>
                Create Proposal
              </Button>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create()(ProposeForm)
