import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from './Sidebar'
import { Button, Table } from 'antd'
import { proposeProject } from '../actions/projectActions'
import { push } from 'react-router-redux'
import {eth, web3, tr, dt, pl} from '../utilities/blockchain'
import * as _ from 'lodash'
import moment from 'moment'

class Propose extends Component {
  constructor () {
    super()
    this.state = {
      value: 0,
      description: '',
      projects: [],
      tempProject: {},
      currPrice: 0
    }

    this.proposeProject = this.proposeProject.bind(this)
    this.getCurrentPrice = this.getCurrentPrice.bind(this)
    // this.checkTransactionMined = this.checkTransactionMined.bind(this)
    this.getProjects = this.getProjects.bind(this)
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

  proposeProject () {
    // stakingPeriod in Days changed to milliseconds
    let stakeEndDate = (Date.now() + 86400000 * this.state.tempProject.stakingPeriod)
    this.setState({tempProject: Object.assign({}, this.state.tempProject, {stakingEndDate: stakeEndDate})})
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        let cost = parseInt(web3.toWei(this.state.tempProject.cost, 'ether').toString(), 10)
        await tr.proposeProject(cost, stakeEndDate, {from: accounts[0]}).then(tx => {
          let txReceipt = tx.receipt
          let projectAddress = '0x' + txReceipt.logs[0].topics[1].slice(txReceipt.logs[0].topics[1].length - 40, (txReceipt.logs[0].topics[1].length))
          if (!_.isEmpty(this.state.tempProject)) {
            this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress}))
            this.setState({tempProject: {}})
          }
        })
      }
    })
  }

  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state.tempProject, {[type]: val})
      this.setState({tempProject: temp})
    } catch (error) {
      throw new Error(error)
    }
  }

  componentWillReceiveProps (np) {
    let projectsArr
    function projectState (address) {
      // console.log(address)
      return new Promise(async (resolve, reject) => {
        let status = await pl.isStaked(address)
        resolve(status)
      })
    }
    let d
    let projects = Object.keys(np.projects).map((projAddr, i) => {
      let proj = np.projects[projAddr]
      return projectState(projAddr)
        .then(status => {
          if (!status) {
            if (typeof proj.stakingEndDate !== 'undefined') { d = moment(proj.stakingEndDate) }
            return {
              key: i,
              index: i,
              address: proj.address,
              cost: proj.cost,
              description: proj.description,
              stakingEndDate: (typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A')
            }
          }
        })
    })

    Promise.all(projects)
      .then(results => {
        projectsArr = _.compact(results)
        this.setState({projects: projectsArr})
      })
      .catch(e => {
        console.error(e)
      })
  }
  render () {
    const columns = [{
      title: '#',
      dataIndex: 'index',
      key: 'index'
    }, {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    }, {
      title: 'Cost (ether)',
      dataIndex: 'cost',
      key: 'cost'
    }, {
      title: 'Staking End Date',
      dataIndex: 'stakingEndDate',
      key: 'stakingEndDate'
    }]
    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200}}>
          <header className='App-header'>
            <h3 className='App-title'>Current Proposals</h3>
          </header>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{marginLeft: 20, marginTop: 40}}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Table dataSource={this.state.projects} columns={columns} />
              </div>
            </div>
            <div style={{marginLeft: 20, marginTop: 40}}>
              {/* <Input getRef={(input) => (this.location = input)}  onChange={(e) => this.onChange('location', this.location.value)} value={location || ''} /> */}
              <div>
                <h3>Propose:</h3>
                <input
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
    user: state.user.user,
    projects: state.projects.allProjects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proposeProject: (projectDetails) => dispatch(proposeProject(projectDetails)),
    reroute: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Propose)
