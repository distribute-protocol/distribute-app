import React from 'react'
import { Dropdown, Menu, Button, Icon } from 'antd'

export default () => {
  const projectLimiter = (
    <Menu>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>All</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>Mesh Network</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>Urban Agriculture</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>Land Trust</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>Open Source Software</p>
      </Menu.Item>
    </Menu>
  )
  const mileage = (
    <Menu>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>1 mile</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>5 miles</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>10 miles</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>50 miles</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>100 miles</p>
      </Menu.Item>
    </Menu>
  )
  const sortedBy = (
    <Menu>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>End Date</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>Project Cost</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>Most Staked</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>Least Staked</p>
      </Menu.Item>
      <Menu.Item>
        <p
          // onClick={() => this.setState({collateralType: 'Tokens'})}
          target='_blank' rel='noopener noreferrer'>Staker</p>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <div style={{marginTop: 20, marginBottom: 10, color: 'black', backgroundColor: 'white', display: 'flex', justifyContent: 'center', fontFamily: 'Lato', fontSize: 20}}>
        <p style={{marginRight: 10}}> Show me</p>
        <Dropdown overlay={projectLimiter} >
          <Button style={{ maxWidth: 350, border: '1px solid black', borderRadius: 4, textAlign: 'left' }}>
            <Icon type='down' />All
          </Button>
        </Dropdown>
        <p style={{marginLeft: 10, marginRight: 10}}>projects within</p>
        <Dropdown overlay={mileage} >
          <Button style={{ maxWidth: 350, border: '1px solid black', borderRadius: 4, textAlign: 'left' }}>
            <Icon type='down' />50 miles
          </Button>
        </Dropdown>
        <p style={{marginLeft: 10, marginRight: 10}}>sorted by</p>
        <Dropdown overlay={sortedBy} >
          <Button style={{ maxWidth: 350, border: '1px solid black', borderRadius: 4, textAlign: 'left' }}>
            <Icon type='down' />Most Staked
          </Button>
        </Dropdown>
      </div>
      <hr />
    </div>
  )
}
