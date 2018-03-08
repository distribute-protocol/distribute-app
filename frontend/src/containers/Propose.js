import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from './Sidebar'
import { Button, Table } from 'antd'
import { proposeProject } from '../actions/projectActions'
import { push } from 'react-router-redux'
import {eth, web3, tr, dt, pl} from '../utilities/blockchain'
import * as _ from 'lodash'
import moment from 'moment'
import ipfsAPI from 'ipfs-api'
let ipfs = ipfsAPI()

class Propose extends Component {
  constructor () {
    super()
    this.state = {
      tempProject: {},
      currPrice: 0
    }

    this.proposeProject = this.proposeProject.bind(this)
    this.getCurrentPrice = this.getCurrentPrice.bind(this)
    // this.checkTransactionMined = this.checkTransactionMined.bind(this)
    this.getProjects = this.getProjects.bind(this)
    this.upload = this.upload.bind(this)
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

  async proposeProject () {
    // stakingPeriod in Days changed to milliseconds
    let stakeEndDate = (Date.now() + 86400000 * this.state.tempProject.stakingPeriod)
    this.setState({tempProject: Object.assign({}, this.state.tempProject, {stakingEndDate: stakeEndDate})})
    const obj = {
      Data: JSON.stringify(this.state.tempProject),
      Links: []
    }
    // console.log(obj)
    let multiHash
    await ipfs.object.put(obj, {enc: 'json'}, (err, node) => {
      if (err) {
        throw err
      }
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          let cost = parseInt(web3.toWei(this.state.tempProject.cost, 'ether').toString(), 10)
          await tr.proposeProject(cost, stakeEndDate, web3.fromAscii(node.toJSON().multihash), {from: accounts[0]}).then(tx => {
            let txReceipt = tx.receipt
            let projectAddress = '0x' + txReceipt.logs[0].topics[1].slice(txReceipt.logs[0].topics[1].length - 40, (txReceipt.logs[0].topics[1].length))
            if (!_.isEmpty(this.state.tempProject)) {
              this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress, ipfsHash: `https://ipfs.io/ipfs/${multiHash}`}))
              this.setState({tempProject: {}})
            }
          })
        }
      })
    })
  }

  onChange (e) {
    let tempProject = Object.assign({}, this.state.tempProject, {[e.target.name]: e.target.value})
    this.setState({tempProject})
    // try {
    //   let temp =, {[type]: val})
    //   this.setState({tempProject: temp})
    // } catch (error) {
    //   throw new Error(error)
    // }
  }

  // componentWillReceiveProps (np) {
  //   let projectsArr
  //   function projectState (address) {
  //     // console.log(address)
  //     return new Promise(async (resolve, reject) => {
  //       let status = await pl.isStaked(address)
  //       resolve(status)
  //     })
  //   }
  //   let d
  //   let projects = Object.keys(np.projects).map((projAddr, i) => {
  //     let proj = np.projects[projAddr]
  //     return projectState(projAddr)
  //       .then(status => {
  //         if (!status) {
  //           if (typeof proj.stakingEndDate !== 'undefined') { d = moment(proj.stakingEndDate) }
  //           return {
  //             key: i,
  //             index: i,
  //             address: proj.address,
  //             cost: proj.cost,
  //             description: proj.description,
  //             stakingEndDate: (typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A')
  //           }
  //         }
  //       })
  //   })
  //
  //   Promise.all(projects)
  //     .then(results => {
  //       projectsArr = _.compact(results)
  //       this.setState({projects: projectsArr})
  //     })
  //     .catch(e => {
  //       console.error(e)
  //     })
  // }

  upload () {
    const reader = new FileReader()
    reader.onloadend = () => {
      const buf = Buffer(reader.result) // Convert data into buffer
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if (err) {
          console.error(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        console.log(`Url --> ${url}`)
        let tempProject = Object.assign({}, this.state.tempProject, {photo: url})
        this.setState({tempProject})
        // document.getElementById('url').innerHTML= url
        // document.getElementById('url').href= url
        // document.getElementById('output').src = url
      })
    }
    const photo = this.photo
    reader.readAsArrayBuffer(photo.files[0]) // Read Provided File
  }

  render () {
    // const columns = [{
    //   title: '#',
    //   dataIndex: 'index',
    //   key: 'index'
    // }, {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   key: 'description'
    // }, {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address'
    // }, {
    //   title: 'Cost (ether)',
    //   dataIndex: 'cost',
    //   key: 'cost'
    // }, {
    //   title: 'Staking End Date',
    //   dataIndex: 'stakingEndDate',
    //   key: 'stakingEndDate'
    // }]
    let inputs = [
      {title: 'Name', name: 'name'},
      {title: 'Summary', name: 'summary'},
      {title: 'Location', name: 'location'},
      {title: 'Cost', name: 'cost'},
      {title: 'Staking Period', name: 'stakingPeriod'}
    ].map((obj, i) => {
      if (obj.name === 'cost' || obj.name === 'stakingPeriod') {
        return (<div key={i}>
          <h3>{obj.title}</h3>
          <input
            name={obj.name}
            type={'number'}
            placeholder={obj.title}
            onChange={(e) => this.onChange(e)}
            value={this.state.tempProject[obj.name] || ''}
          />
        </div>)
      }
      return (<div key={i}>
        <h3>{obj.title}</h3>
        <input
          name={obj.name}
          placeholder={obj.title}
          onChange={(e) => this.onChange(e)}
          value={this.state.tempProject[obj.name] || ''}
        />
      </div>)
    })
    console.log(this.state.tempProject)
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200}}>
          <header className='App-header'>
            <h3 className='App-title2'>Propose Project</h3>
          </header>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            {/* <div style={{marginLeft: 20, marginTop: 40}}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Table dataSource={this.state.projects} columns={columns} />
              </div>
            </div> */}
            <div style={{marginLeft: 20, marginTop: 40}}>
              {/* <Input getRef={(input) => (this.location = input)}  onChange={(e) => this.onChange('location', this.location.value)} value={location || ''} /> */}
              <div>
                <h3>Propose:</h3>
                {/* <input
                  ref={(input) => (this.description = input)}
                  placeholder='Project Description'
                  onChange={(e) => this.onChange('description', this.description.value)}
                  value={this.state.tempProject.description || ''}
                />
                <input
                  ref={(input) => (this.cost = input)}
                  placeholder='Price in ETH'
                  onChange={(e) => this.onChange('cost', this.cost.value)}
                  style={{marginLeft: 10}}
                  value={this.state.tempProject.cost || ''}
                />
                <input
                  ref={(input) => (this.stakingPeriod = input)}
                  placeholder='Expiration Date'
                  onChange={(e) => this.onChange('stakingPeriod', this.stakingPeriod.value)}
                  style={{marginLeft: 10}}
                  value={this.state.tempProject.stakingPeriod || ''}
                />
              </div> */}
                {inputs}
              </div>
              <div>
                <input type='file' name='photo' id='photo' ref={(input) => this.photo = input} />
                <button type='button' onClick={this.upload}>Upload</button>
              </div>
              <div style={{marginTop: 20}}>
                <h4>{`You have to deposit ${typeof this.state.tempProject.cost === 'undefined' ? 0 : Math.ceil((web3.toWei(this.state.tempProject.cost, 'ether') / 20) / this.state.currPrice)} tokens`}</h4>
              </div>
              <div style={{marginTop: 20}}>
                <Button type='info' onClick={this.proposeProject} style={{marginLeft: 10}}>
                  Propose Project
                </Button>
              </div>
            </div>
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
