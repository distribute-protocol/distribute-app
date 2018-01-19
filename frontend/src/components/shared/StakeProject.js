import React from 'react'
import moment from 'moment'
import { Card, CardBody, CardTitle, CardText, Button, Col } from 'reactstrap'

const StakeProject = ({cost, description, stakingEndDate, address, index}) => {
  let d
  // if (typeof stakingEndDate !== 'undefined') { d = new Date(stakingEndDate) }
  if (typeof stakingEndDate !== 'undefined') { d = moment(stakingEndDate) }
  return (
    <Col sm="10">
      <Card body style={{marginLeft: 10}}>
        <CardBody>
          <CardTitle>{`${description}`}</CardTitle>
          <CardText>{`${address}`}</CardText>
          <CardText>{`${cost}`} ETH</CardText>
          {/* <td>{typeof d !== 'undefined' ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : 'N/A'}</td> */}
          <CardText>staking expires in {typeof d !== 'undefined' ? `${d.fromNow()}` : 'N/A'}</CardText>
          <Button color='primary' onClick={this.stakeProject} style={{marginLeft: 10}}>
            Stake
          </Button>
          <Button color='primary' onClick={this.unstakeProject} style={{marginLeft: 10}}>
            Unstake
          </Button>
        </CardBody>
      </Card>
    </Col>
  )
}

export default StakeProject
