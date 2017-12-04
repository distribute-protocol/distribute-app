import React from 'react'
import { TokenHolderRegistryABI, TokenHolderRegistryAddress, TokenHolderRegistryBytecode } from '../abi/TokenHolderRegistry'
import { WorkerRegistryABI, WorkerRegistryAddress, WorkerRegistryBytecode } from '../abi/WorkerRegistry'
import { Button } from 'reactstrap'

import Eth from 'ethjs'

const eth = new Eth(window.web3.currentProvider)

class Propose extends React.Component {
  constructor () {
    super()
    this.state = {
      value: 0,
      projectCost: {}
    }
    this.THR = eth.contract(JSON.parse(TokenHolderRegistryABI), TokenHolderRegistryBytecode)
    this.WR = eth.contract(JSON.parse(WorkerRegistryABI), WorkerRegistryBytecode)
    this.thr = this.THR.at(TokenHolderRegistryAddress)
    this.wr = this.WR.at(WorkerRegistryAddress)
    this.getProposals.bind(this)
    this.proposeProject.bind(this)
    this.onChange.bind(this)
    window.thr = this.thr
  }

  componentWillMount () {
    this.getProposals()
  }

  async getProposals () {
    try {
      this.setState({})
    } catch (error) {
      throw new Error(error)
    }
  }

  proposeProject () {
    let thr = this.thr
    eth.accounts().then(accountsArr => {
      thr.proposeProject(this.projectCost.value, 10000000000, {from: accountsArr[0]})
      this.getProposals()
    })
  }

  async onChange (val) {
    try {
      console.log('on change')
      this.projectCost= val;
      console.log(this.projectCost);
      this.setState({projectCost: val})
    } catch (error) {
      throw new Error(error)
    }
  }

  render () {
    return (
      <div style={{marginLeft: 200}}>
        <header className='App-header'>
          {/* <img src={logoclassName='App-logo' alt='logo' /> */}
          <h1 className='App-title'>distribute</h1>
        </header>
        <div style={{marginLeft: 20, marginTop: 40}}>
          <h3>Current Proposals</h3>
          <ul>{this.state.projectDescription}</ul>
        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div>
              {/* <Input getRef={(input) => (this.location = input)}  onChange={(e) => this.onChange('location', this.location.value)} value={location || ''} /> */}
            <div>
              <h3>Propose:</h3>
              <input ref={(input) => (this.projectDescription = input)} placeholder='Project Description' onChange={(e) => this.onChange(this.projectDescription)} />
              <input ref={(input) => (this.projectCost = input)} placeholder='Price in ETH' onChange={(e) => this.onChange(this.projectCost.value)} />
            </div>
            <div style={{marginTop: 20}}>
              <h4>{`You have to put down ${typeof this.projectCost === 'undefined' ? '__' : this.state.projectCost/20}`} ETH worth of tokens</h4>
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

export default Propose
