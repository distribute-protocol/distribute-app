import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button } from 'reactstrap'
import { proposeProject } from '../actions/projectActions'
import utils from '../utilities/utils'

import {eth, tr, rr, pr} from '../utilities/blockchain'
import Eth from 'ethjs'
//
// const eth = new Eth(window.web3.currentProvider)
// window.Eth = Eth

const Project = ({cost, description, index}) => {
  return (
    <tr>
      <td>{`${description}`}</td>
      <td>{`${cost}`}</td>
    </tr>
  )
}
class Propose extends Component {
  constructor () {
    super()
    this.state = {
      value: 0,
      cost: '',
      description: '',
      projects: [],
      tempProject: {}
    }

    this.proposeProject = this.proposeProject.bind(this)
    //this.checkTransactionMined = this.checkTransactionMined.bind(this)
    this.getProjects = this.getProjects.bind(this)
    window.tr = this.tr
    window.projects = this.state.projects
  }

  componentWillMount () {
    this.getProjects()
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
    eth.accounts().then(accountsArr => {
      // console.log('test')
      return tr.proposeProject(Eth.toWei(this.state.tempProject.cost, 'ether'), 10000000000000, {from: accountsArr[0]})
    }).then(txhash => {
      let mined = utils.checkTransactionMined(txhash)
      console.log(mined)
      return mined
    }).then((mined) => {
      if (mined === true) {
        this.props.proposeProject(this.state.tempProject)
      }
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

  async onDescriptionChange (val) {
    try {
      let temp = Object.assign({}, this.state.tempProject, {description: val})
      this.setState({tempProject: temp})
      // console.log('set state for description')
    } catch (error) {
      throw new Error(error)
    }
  }

  async onCostChange (val) {
    try {
      let temp = Object.assign({}, this.state.tempProject, {cost: val})
      this.setState({tempProject: temp})
      // console.log('set state for cost')
    } catch (error) {
      throw new Error(error)
    }
  }

  render () {
    const projects = this.props.projects.projects.map((proj, i) => {
      return <Project cost={proj.cost} description={proj.description} index={i} />
    })
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          {/* <img src={logoclassName='App-logo' alt='logo' /> */}
          <h1 className='App-title'>distribute</h1>
        </header>
        <div style={{marginLeft: 20, marginTop: 40}}>
          <h3>Current Proposals</h3>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <table style={{width: 500, border: '1px solid black'}}>
              <thead>
                <tr>
                  <th>Project Description</th>
                  <th>Project Cost</th>
                </tr>
              </thead>
              <tbody>
                {projects}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div>
            {/* <Input getRef={(input) => (this.location = input)}  onChange={(e) => this.onChange('location', this.location.value)} value={location || ''} /> */}
            <div>
              <h3>Propose:</h3>
              <input ref={(input) => (this.description = input)} placeholder='Project Description' onChange={(e) => this.onDescriptionChange(this.description.value)} value={this.state.tempProject.description} />
              <input ref={(input) => (this.cost = input)} placeholder='Price in ETH' onChange={(e) => this.onCostChange(this.cost.value)} style={{marginLeft: 10}} value={this.state.tempProject.cost} />
            </div>
            <div style={{marginTop: 20}}>
              <h4>{`You have to put down ${typeof this.state.cost === 'undefined' ? '__' : this.state.tempProject.cost / 20} ETH worth of tokens`}</h4>
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
