import React from 'react'
import { connect } from 'react-redux'
import ValidateComponent from '../../components/project/Validate'
import { Button } from 'antd'
import {eth, pr, tr, web3, P} from '../../utilities/blockchain'
import { taskValidated } from '../../actions/projectActions'
import moment from 'moment'
import ipfsAPI from 'ipfs-api'
let ipfs = ipfsAPI()

class ValidateTasks extends React.Component {
  constructor () {
    super()
    this.state = {}
    this.checkVoting = this.checkVoting.bind(this)
  }

  componentWillMount () {
    this.getProjectStatus()
  }

  // let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
  async getProjectStatus () {
    let accounts
    let p = P.at(this.props.address)
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        if (accounts.length) {
          let weiCost = (await p.weiCost()).toNumber()
          let reputationCost = (await p.reputationCost()).toNumber()
          let ipfsHash = web3.toAscii(await p.ipfsHash())
          let nextDeadline = (await p.nextDeadline()) * 1000
          let projectState = (await p.state())
          let projObj = {
            weiCost,
            reputationCost,
            ipfsHash,
            nextDeadline,
            state: projectState,
            project: p,
            taskList: this.props.project.taskList
          }
          ipfs.object.get(ipfsHash, (err, node) => {
            if (err) {
              throw err
            }
            let dataString = new TextDecoder('utf-8').decode(node.toJSON().data)
            projObj = Object.assign({}, projObj, JSON.parse(dataString))
            this.setState(projObj)
          })
        }
      }
    })
  }

  onChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  validateTask (val, index, status) {
    let validator
    let valStatus = status
    eth.getAccounts(async (err, accounts) => {
      validator = accounts[0]
      if (!err) {
        if (accounts.length) {
          await tr.validateTask(this.props.address, index, val, status, {from: accounts[0]})
          .then(async () => {
            this.setState({['val' + index]: ''})
            this.props.taskValidated({ address: this.props.address, validator: validator, index: index, status: valStatus })
          })
        }
      }
    })
  }

  checkVoting () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        await pr.checkVoting(this.props.address, {from: accounts[0]}).then((res) => {
          return res
        })
      }
    })
  }

  render () {
    let tasks
    let returnInput = (i) => (
      <div>
        <div>
          <input
            name={'val' + i}
            placeholder='tokens'
            onChange={(e) => this.onChange(e)}
            value={this.state['val' + i] || ''}
          />
        </div>
        <div>
          <Button
            type='danger'
            disabled={this.props.project.taskList[i].validated[eth.accounts[0]]}
            onClick={() => this.validateTask(this.state['val' + i], i, true)} >Yes</Button>
          <Button
            type='danger'
            disabled={this.props.project.taskList[i].validated[eth.accounts[0]]}
            onClick={() => this.validateTask(this.state['val' + i], i, false)} >No</Button>
        </div>
      </div>)
    if (typeof this.props.project.taskList !== 'undefined') {
      tasks = this.props.project.taskList.map((task, i) => {
        return {
          key: i,
          description: task.description,
          ethReward: `${web3.fromWei(task.weiReward, 'ether')} ETH`,
          input: returnInput(i)
        }
      })
    } else {
      tasks = []
    }

    return (
      <ValidateComponent
        name={this.state.name}
        address={this.props.address}
        photo={this.state.photo}
        summary={this.state.summary}
        location={this.state.location}
        cost={web3.fromWei(this.state.cost, 'ether')}
        reputationCost={this.state.reputationCost}
        date={moment(this.state.nextDeadline)}
        tasks={tasks}
        checkVoting={this.checkVoting}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects.allProjects[ownProps.address]
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    taskValidated: (validationDetails) => dispatch(taskValidated(validationDetails))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidateTasks)
