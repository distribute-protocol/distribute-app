import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
// import { Card, CardBody, CardTitle, CardText, Button, Col } from 'reactstrap'
import { Card, Button } from 'antd'
import {eth, web3, dt, pr, P} from '../../utilities/blockchain'

const getProjectState = () => ({ type: 'GET_PROJECT_STATE' })

class ClaimProject extends React.Component {
  constructor () {
    super()
    this.state = {
      value: ''
    }
    window.pr = pr
  }

  onChange (val) {
    try {
      this.setState({value: val})
      // console.log('set state for description')
    } catch (error) {
      throw new Error(error)
    }
  }

  getProjectStatus (p) {
    let accounts
    eth.getAccounts(async (err, result) => {
      if (!err) {
        accounts = result
        // console.log('accounts', accounts)
        if (accounts.length) {
          let nextDeadline,
            taskHashes
          p.nextDeadline().then(result => {
            nextDeadline = result.toNumber()
            // this.setState
            // console.log('nextDeadline', nextDeadline)
            // console.log('p', p)
          })
          .then(() => {
            pr.projectTaskList.call(this.props.address).then(result => {
              // console.log(result)
              // taskHashes = result.toNumber()
              // console.log('taskHashes', taskHashes)
              // this.setState({
              //   nextDeadline,
              //   taskHashes
            })
            console.log('state', this.state)
            // })
          })
        }
      }
    })
  }

  componentWillMount () {
    // let p = P.at(this.props.address)
    let p = P.at(this.props.address)
    // console.log(p, this.props.address)
    this.getProjectStatus(p)
    this.setState({project: p})
  }

  render () {
    let d
    // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
    if (typeof this.state.nextDeadline !== 'undefined') { d = moment(this.state.nextDeadline) }
    // console.log(this.state)
    console.log(this.state.nextDeadline)
    return (
      // <Col sm='10'>
      <Card title={`${this.props.description}`} min-width='400'>
        <div style={{wordWrap: 'break-word'}}>{`${this.props.address}`}</div>
        {/* <div>{`${this.props.cost}`} ETH</div> */}
        {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
        <div>task submission expires in {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</div>
        <input
          ref={(input) => (this.stakedValue = input)}
          placeholder='proposed task'
          onChange={() => this.onChange(this.stakedValue.value)}
          value={this.state.value}
        />
        <Button color='primary' onClick={() => this.props.addTaskHash(this.state.value)} style={{marginLeft: 10}}>
          Add Task
        </Button>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projectState: state.projects.fetching,
    project: state.projects.project
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getProjectState: getProjectState
  }, dispatch)
  // return {
  //   getProjectState: () => console.log('heyhey')
  // }
}
 // = ({cost, description, stakingEndDate, address, index, stakeProject, unstakeProject, stakingAmount}) => {

export default connect(mapStateToProps, mapDispatchToProps)(ClaimProject)
