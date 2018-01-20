import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Table } from 'reactstrap'
import Project from '../components/shared/Project'
import { proposeProject } from '../actions/projectActions'
// import utils from '../utilities/utils'
import {eth, web3, tr, dt} from '../utilities/blockchain'
import * as _ from 'lodash'

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
    // this.checkTransactionMined = this.checkTransactionMined.bind(this)
    this.getProjects = this.getProjects.bind(this)
    // window.tr = this.tr
    // window.projects = this.state.projects
  }

  componentWillMount () {
    // this.getProjects()
    dt.currentPrice((err, val) => {
      if (!err) {
        this.setState({currPrice: val.toNumber()})
      }
    })

    // let filter = eth.filter({address: tr.address})
    // filter.watch((err, res) => {
    //   if (!err) {
    //     console.log('log filter', res)
    //     // console.log('0x' + res.topics[1].slice(res.topics[1].length - 40, (res.topics[1].length)))
    //     // let projectAddress = '0x' + res.topics[1].slice(res.topics[1].length - 40, (res.topics[1].length))
    //     // if (!_.isEmpty(this.state.tempProject)) {
    //     //   this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress}))
    //     //   this.setState({tempProject: {}})
    //     // }
    //   } else {
    //     console.log('errorWeb3', err)
    //   }
    // })
    //
    // let event = tr.ProjectCreated()
    // event.watch((err, res) => {
    //   if (!err) {
    //     console.log('event', res)
    //     // if (!_.isEmpty(this.state.tempProject)) {
    //     //   this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: res.args.projectAddress}))
    //     //   this.setState({tempProject: {}})
    //     // }
    //   } else {
    //     console.log('errorWeb3', err)
    //   }
    // })
    // console.log(localStorage.projectDescription)
    // console.log(localStorage.projectCost)
  }

  getProjects () {
  //   if (localStorage.projects !== undefined) {
  //     let projectList = []
  //     for (let i=0; i < JSON.parse(localStorage.projects).length; i++) {
  //       let temp = JSON.parse(localStorage.projects)[i]
  //       projectList.push(temp)
  //       //console.log(temp)
  //       //console.log(JSON.parse(localStorage.projects)[0])
  //     }
  //     if (projectList !== undefined) {
  //       this.setState({projects: projectList})
  //     }
  //   }
  }

  proposeProject () {
    // stakingPeriod in Days changed to milliseconds
    let stakeEndDate = (Date.now() + 86400000 * this.state.tempProject.stakingPeriod)
    this.setState({tempProject: Object.assign({}, this.state.tempProject, {stakingEndDate: stakeEndDate})})
    eth.getAccounts((err, accounts) => {
      if (!err) {
        let cost = parseInt(web3.toWei(this.state.tempProject.cost, 'ether').toString())
        tr.proposeProject(cost, stakeEndDate, {from: accounts[0]}, (err, txHash) => {
          if (!err) {
            eth.getTransactionReceipt(txHash, (err, txReceipt) => {
              if (!err) {
                console.log(txReceipt)
                if (txReceipt.status === 1) {
                  // console.log('sup', tr.ProjectCreated({},
                  // {fromBlock: tr.blockNumber, toBlock: txReceipt.blockNumber})
                  // .get()
                  // .filter(function (e) {
                  //   return e.transactionHash === txReceipt.transactionHash
                  // }))
                  let projectAddress = '0x' + txReceipt.logs[0].topics[1].slice(txReceipt.logs[0].topics[1].length - 40, (txReceipt.logs[0].topics[1].length))
                  if (!_.isEmpty(this.state.tempProject)) {
                    this.props.proposeProject(Object.assign({}, this.state.tempProject, {address: projectAddress}))
                    this.setState({tempProject: {}})
                  }
                }
              }
            })
          }
        })
      }
    })
  }

  onChange (type, val) {
    try {
      let temp = Object.assign({}, this.state.tempProject, {[type]: val})
      this.setState({tempProject: temp})
      // console.log('set state for description')
    } catch (error) {
      throw new Error(error)
    }
  }

  render () {
    const projects = this.props.projects.projects.map((proj, i) => {
      return <Project key={i} index={i} address={proj.address} cost={proj.cost} description={proj.description} stakingEndDate={proj.stakingEndDate} />
    })
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          {/* <img src={logoclassName='App-logo' alt='logo' /> */}
          <h1 className='App-title'>distribute</h1>
        </header>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{marginLeft: 20, marginTop: 40}}>
            <h3>Current Proposals</h3>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Project Description</th>
                    <th>Project Address</th>
                    <th>Project Cost (ether)</th>
                    <th>Staking End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects}
                </tbody>
              </Table>
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
              <h4>{`You have to deposit ${typeof this.state.tempProject.cost === 'undefined' ? 0 : ((web3.toWei(this.state.tempProject.cost, 'ether') / 20) / this.state.currPrice)} tokens`}</h4>
            </div>
            <div style={{marginTop: 20}}>
              <Button color='info' onClick={this.proposeProject} style={{marginLeft: 10}}>
                Propose Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proposeProject: (projectDetails) => dispatch(proposeProject(projectDetails))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Propose)
