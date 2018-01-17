import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button } from 'reactstrap'
import Project from '../components/shared/Project'
import { proposeProject } from '../actions/projectActions'
import utils from '../utilities/utils'

import {eth, tr, dt, rr, pr} from '../utilities/blockchain'
import Eth from 'ethjs'
//
// const eth = new Eth(window.web3.currentProvider)
// window.Eth = Eth

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
    //this.checkTransactionMined = this.checkTransactionMined.bind(this)
    this.getProjects = this.getProjects.bind(this)
    window.tr = this.tr
    window.projects = this.state.projects
  }

  componentWillMount () {
    this.getProjects()
    dt.currentPrice().then(val => {
      this.setState({currPrice: val[0].toNumber()})
    })
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
// (Date.now() + (this.state.tempProject.stakingPeriod * 86400))
  proposeProject () {
    // stakingPeriod in Days changed to milliseconds
    let stakeEndDate = (Date.now() + 86400000 * this.state.tempProject.stakingPeriod)
    eth.accounts().then(accounts => {
      tr.ProjectCreated((error, result) => {
        if (!error) {
          console.log('result', result)
          this.props.proposeProject(Object.assign({}, this.state.tempProject, {stakingPeriod: stakeEndDate, address: result.args.projectAddress}))
        } else {
          console.log('error', error)
        }
      })
      pr.LogProjectCreated((error, result) => {
        if (!error) {
          console.log('result', result)
          this.props.proposeProject(Object.assign({}, this.state.tempProject, {stakingPeriod: stakeEndDate, address: result.args.projectAddress}))
        } else {
          console.log('error', error)
        }
      })
      let cost = parseInt(Eth.toWei(this.state.tempProject.cost, 'ether').toString())
      return tr.proposeProject(cost, stakeEndDate, {from: accounts[0]})
    })
    .then(txhash => {
      let mined = utils.checkTransactionMined(txhash)
      // console.log(mined)
      return mined
    }).then((mined) => {
      if (mined === true) {

      }
      return true
    })
  }

  // async checkTransactionMined(txhash) {
  //   try {
  //     let txreceipt = (await eth.getTransactionReceipt(txhash))
  //     let mined
  //     txreceipt.status === 1
  //     ? mined = true
  //     : mined = false
  //     //console.log(txreceipt.status)
  //     //console.log(mined)
  //     return mined
  //   } catch (error) {
  //     throw new Error(error)
  //   }
  // }

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
      return <Project key={i} cost={proj.cost} description={proj.description} index={i} stakingPeriod={proj.stakingPeriod} />
    })
    // console.log(this.state.currPrice)
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
              <table style={{width: 500, border: '1px solid black'}}>
                <thead>
                  <tr>
                    <th>Project Description</th>
                    <th>Project Address</th>
                    <th>Project Cost (ether)</th>
                    <th>Staking End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects}
                </tbody>
              </table>
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
              <h4>{`You have to deposit ${typeof this.state.tempProject.cost === 'undefined' ? 0 : ((Eth.toWei(this.state.tempProject.cost, 'ether') / 20) / this.state.currPrice)} tokens`}</h4>
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
