import React from 'react'
import { connect } from 'react-redux'
import ValidateComponent from '../../components/project/4Validate'
import { Button, Table } from 'antd'
import {eth, pr, web3} from '../../utilities/blockchain'
import { getTasks } from '../../actions/taskActions'
import moment from 'moment'

class ValidateTasks extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: []
    }
    this.checkVoting = this.checkVoting.bind(this)
  }

  componentWillMount () {
    this.getProjectStatus()
    this.getTasks()
  }

  // let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
  async getProjectStatus () {
    this.setState(this.props.project)
  }

  async getTasks () {
    this.props.getTasks(this.props.address, this.props.project.state)
  }

  onChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  validateTask (index, validationState) {
    console.log(validationState)
    this.props.validateTask(this.props.address, index, validationState)
  }

  async getValidations (address, index, validationState) {
    this.props.getValidations(this.props.address, index, validationState)
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
    console.log(this.props.tasks)
    let tasks
    const columns = [{
      title: 'Yes Validators',
      dataIndex: 'yesval',
      key: 'yesval'
    }, {
      title: 'No Validators',
      dataIndex: 'noval',
      key: 'noval'
    }]
    let validations
    let returnInput = (i) => (
      <div>
        <div>
          <Button
            type='danger'
            // disabled={this.props.tasks[i].validated[eth.accounts[0]]}
            onClick={() => this.validateTask(i, true)} >Yes</Button>
          <Button
            type='danger'
            // disabled={this.props.tasks[i].validated[eth.accounts[0]]}
            onClick={() => this.validateTask(i, false)} >No</Button>
        </div>
        <div>
          <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
            <Table style={{backgroundColor: '#ffffff'}} dataSource={validations} columns={columns} pagination={false} />
          </div>
        </div>
      </div>)
    if (typeof this.props.tasks !== 'undefined') {
      tasks = this.props.tasks.map((task, i) => {
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
    project: state.projects[4][ownProps.address],
    tasks: state.projects[4][ownProps.address].tasks
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getTasks: (address, state) => dispatch(getTasks(address, state))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidateTasks)
