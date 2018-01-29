import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
// import { Card, CardBody, CardTitle, CardText, Button, Col } from 'reactstrap'
import { Card, Button } from 'antd'
import {eth, web3, dt, P} from '../../utilities/blockchain'

const getProjectState = () => ({ type: 'GET_PROJECT_STATE' })

class ClaimProject extends Component {
  constructor () {
    super()
    this.state = {
      value: ''
    }
  }

  onChange (val) {
    try {
      this.setState({value: val})
      // console.log('set state for description')
    } catch (error) {
      throw new Error(error)
    }
  }

  render () {
    let d
    // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
    if (typeof this.props.taskHashEndDate !== 'undefined') { d = moment(this.props.taskHashEndDate) }
    // console.log(this.state)
    return (
      // <Col sm='10'>
      <Card style={{marginLeft: 10}} title={`${this.props.description}`}>
        {/* <div style={{wordWrap: 'break-word'}}>{`${this.props.address}`}</div> */}
        {/* <div>{`${this.props.cost}`} ETH</div> */}
        {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
        <div>task submission expires in {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</div>
        <input
          ref={(input) => (this.stakedValue = input)}
          placeholder='proposed task'
          onChange={() => this.onChange(this.stakedValue.value)}
          value={this.state.value}
        />
        <Button color='primary' onClick={() => this.props.addTask(this.state.value)} style={{marginLeft: 10}}>
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
