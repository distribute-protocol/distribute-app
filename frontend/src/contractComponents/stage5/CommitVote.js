import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { commitVote } from '../../actions/taskActions'
import { utils } from 'ethers'
import { P, T } from '../../utilities/blockchain'

const ButtonCommitVote = (props) => {
  async function commitVote () {
    let status
    props.status === 'Yes'
      ? status = '1'
      : status = '0'
    let salt = Math.floor(Math.random() * Math.floor(1000000000000000000000)).toString() // get random salt between 0 and 10000
    // convert status and salt to strings
    // let salt = 10000
    // let salt = ethUtil.bufferToHex(ethUtil.setLengthLeft(10000, 32))
    // console.log(salt, 'waw')
    // status = ethUtil.bufferToHex(ethUtil.setLengthLeft(status, 32))
    // console.log(status + salt)
    // props.storeVote(i, status, salt)
    // let vote = {key: i, status, salt, revealed: false, rescued: false}
    // this.setState({votes: Object.assign({}, this.state.votes, {[i]: vote})})
    let secretHash = utils.solidityKeccak256(['int', 'int'], [status, salt])
    // console.log(i, type, status, this.state['tokVal' + i], this.state['repVal' + i])
    // console.log(props.users)
    let taskAddr = await P.at(props.address).tasks(props.i)
    let task = await T.at(taskAddr)
    let pollID = await task.pollId()
    props.commitVote(props.type, props.address, props.i, props.input, secretHash, status, salt, pollID, {from: props.user})
  }
  return (<Button
    type='danger'
    onClick={() => commitVote()}>
    {`${props.status}`}
  </Button>)
}

const mapDispatchToProps = (dispatch) => {
  return {
    commitVote: (collateralType, projectAddress, taskIndex, value, secretHash, vote, salt, pollID, txObj) => dispatch(commitVote(collateralType, projectAddress, taskIndex, value, secretHash, vote, salt, pollID, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonCommitVote)
