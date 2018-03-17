import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/shared/Sidebar'
import { Button, Form, Input, DatePicker, Upload, Icon } from 'antd'
import { proposeProject } from '../actions/projectActions'
import { push } from 'react-router-redux'
import {eth, web3, tr, rr, dt} from '../utilities/blockchain'
import * as _ from 'lodash'
import moment from 'moment'
import ipfsAPI from 'ipfs-api'
let ipfs = ipfsAPI()
const FormItem = Form.Item

class Propose extends Component {
  constructor () {
    super()
    this.state = {
      tempProject: {},
      currPrice: 0,
      loading: false
    }

    this.proposeProject = this.proposeProject.bind(this)
    this.getCurrentPrice = this.getCurrentPrice.bind(this)
    // this.checkTransactionMined = this.checkTransactionMined.bind(this)
    this.getProjects = this.getProjects.bind(this)
    this.upload = this.upload.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount () {
    if (_.isEmpty(this.props.user)) {
      // this.props.reroute()
    } else {
    }
    this.getCurrentPrice()
  }

  getProjects () {
  }

  async getCurrentPrice () {
    await dt.currentPrice()
    .then(val => {
      this.setState({currPrice: val.toNumber()})
    })
  }

  async proposeProject (type) {
    // stakingPeriod in Days changed to milliseconds
    let stakeEndDate = (Date.now() + 86400000 * this.state.tempProject.stakingPeriod)
    this.setState({tempProject: Object.assign({}, this.state.tempProject, {stakingEndDate: stakeEndDate})})
    const obj = {
      Data: JSON.stringify(this.state.tempProject),
      Links: []
    }

    let multiHash
    await ipfs.object.put(obj, {enc: 'json'}, (err, node) => {
      if (err) {
        throw err
      }
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          let cost = parseInt(web3.toWei(this.state.tempProject.cost, 'ether').toString(), 10)
          if (type === 'tokens') {
            await tr.proposeProject(cost, stakeEndDate, web3.fromAscii(node.toJSON().multihash), {from: accounts[0]}).then(tx => {
              let txReceipt = tx.receipt
              let projectAddress = '0x' + txReceipt.logs[0].topics[1].slice(txReceipt.logs[0].topics[1].length - 40, (txReceipt.logs[0].topics[1].length))
              if (!_.isEmpty(this.state.tempProject)) {
                this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress, ipfsHash: `https://ipfs.io/ipfs/${multiHash}`}))
                this.setState({tempProject: {}})
              }
            })
          } else if (type === 'reputation') {
            await rr.proposeProject(cost, stakeEndDate, web3.fromAscii(node.toJSON().multihash), {from: accounts[0]}).then(tx => {
              let txReceipt = tx.receipt
              let projectAddress = '0x' + txReceipt.logs[0].topics[1].slice(txReceipt.logs[0].topics[1].length - 40, (txReceipt.logs[0].topics[1].length))
              if (!_.isEmpty(this.state.tempProject)) {
                this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress, ipfsHash: `https://ipfs.io/ipfs/${multiHash}`}))
                this.setState({tempProject: {}})
              }
            })
          }
        }
      })
    })
  }

  onChange (e) {
    let tempProject = Object.assign({}, this.state.tempProject, {[e.target.name]: e.target.value})
    this.setState({tempProject})
  }

  getBase64 (img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  handleChange (info) {
  // if (info.file.status === 'uploading') {
  //   this.setState({ loading: true })
  //   return
  // }
  // if (info.file.status === 'done') {
    // Get this url from response in real world.
    this.upload(info.file.originFileObj)
    this.getBase64(info.file.originFileObj, imageUrl => this.setState({
      imageUrl
      // loading: false,
    }))
  // }
  }

  upload (photoObj) {
    const reader = new FileReader()
    reader.onloadend = () => {
      const buf = Buffer.from(reader.result) // Convert data into buffer
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if (err) {
          console.error(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        console.log(`Url --> ${url}`)
        let tempProject = Object.assign({}, this.state.tempProject, {photo: url})
        this.setState({tempProject, loading: false})
      })
    }
    // const photo = this.photo
    reader.readAsArrayBuffer(photoObj) // Read Provided File
  }

  render () {
    // let inputs = [
    //   {title: 'Name', name: 'name'},
    //   {title: 'Summary', name: 'summary'},
    //   {title: 'Location', name: 'location'},
    //   {title: 'Cost', name: 'cost'},
    //   {title: 'Staking Period', name: 'stakingPeriod'}
    // ].map((obj, i) => {
    //   if (obj.name === 'cost' || obj.name === 'stakingPeriod') {
    //     return (<div key={i}>
    //       <h3>{obj.title}</h3>
    //       <input
    //         name={obj.name}
    //         type={'number'}
    //         placeholder={obj.title}
    //         onChange={(e) => this.onChange(e)}
    //         value={this.state.tempProject[obj.name] || ''}
    //       />
    //     </div>)
    //   }
    //   return (<div key={i}>
    //     <h3>{obj.title}</h3>
    //     <input
    //       name={obj.name}
    //       placeholder={obj.title}
    //       onChange={(e) => this.onChange(e)}
    //       value={this.state.tempProject[obj.name] || ''}
    //     />
    //   </div>)
    // })
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className='ant-upload-text'>Upload</div>
      </div>
    )
    const imageUrl = this.state.imageUrl
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 100}}>
          <header className='App-header'>
            <h3 className='App-title2'>Propose Project</h3>
          </header>
          <div style={{display: 'flex', flexDirection: 'column', marginLeft: 100, marginRight: 200}}>
            {/* <div style={{marginLeft: 20, marginTop: 40}}> */}
            <Form layout='horizontal' onSubmit={this.handleSubmit}>
              <FormItem label='Name'
                // validateStatus={userNameError ? 'error' : ''}
                // help={userNameError || ''}
              >
                {/*
                //   getFieldDecorator('userName', {
                //   rules: [{ required: true, message: 'Please input your username!' }],
                // })*/}
                  <Input placeholder='Project Name' />
                {/* // } */}
              </FormItem>
              <FormItem label='Photo'>
                <Upload
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  // action='//jsonplaceholder.typicode.com/posts/'
                  // beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                  {typeof imageUrl !== 'undefined' ? <img style={{width: 200, height: 200}} src={imageUrl} alt='' /> : uploadButton}
                </Upload>
                {/* <div style={{display: 'flex', flexDirection: 'row'}}>
                  <input type='file' name='photo' id='photo' ref={(input) => this.photo = input} />
                  <button type='button' onClick={this.upload}>Upload</button>
                </div> */}
              </FormItem>
              <FormItem label='Summary'>
                <Input placeholder='Project Summary' />
              </FormItem>
              <FormItem label='Location'>
                <Input placeholder='Project Location' />
              </FormItem>
              <FormItem label='Cost'>
                <Input placeholder='Project Cost' />
              </FormItem>
              <FormItem label='Staking End Date'>
                <DatePicker />
              </FormItem>
              <div style={{marginTop: 20}}>
                <h4>{`You have to deposit ${typeof this.state.tempProject.cost === 'undefined' ? 0 : Math.ceil((web3.toWei(this.state.tempProject.cost, 'ether') / 20) / this.state.currPrice)} tokens`}</h4>
              </div>
              <div style={{marginTop: 20}}>
                <Button type='info' onClick={() => this.proposeProject('tokens')} style={{marginLeft: 10}}>
                  Propose Project (Tokens)
                </Button>
              </div>
              <div style={{marginTop: 20}}>
                <Button type='info' onClick={() => this.proposeProject('reputation')} style={{marginLeft: 10}}>
                  Propose Project (Reputation)
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // console.log(state.projects.allProjects)
  return {
    user: state.user.user
    // projects: state.projects.allProjects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proposeProject: (projectDetails) => dispatch(proposeProject(projectDetails)),
    reroute: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Propose)
