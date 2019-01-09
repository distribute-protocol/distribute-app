import React from 'react'
import { Dropdown, Menu, Button, Icon } from 'antd'
import { font1 } from '../../styles/fonts'
import { grey3 } from '../../styles/colors'

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
    <div style={{ height: 90, marginLeft: 60, color: 'black', borderBottom: `1px ${grey3} solid`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: font1, fontSize: 20 }}>
        <p style={{ margin: 0, marginRight: 10 }}> Show me</p>
        <Dropdown overlay={projectLimiter} >
          <Button style={{ color: 'black', maxWidth: 350, border: '1px solid black', borderRadius: 4, textAlign: 'left' }}>
            <Icon type='down' />All
          </Button>
        </Dropdown>
        <p style={{ margin: 0, marginLeft: 10, marginRight: 10 }}>projects within</p>
        <Dropdown overlay={mileage} >
          <Button style={{ color: 'black', maxWidth: 350, border: '1px solid black', borderRadius: 4, textAlign: 'left' }}>
            <Icon type='down' />50 miles
          </Button>
        </Dropdown>
        <p style={{ margin: 0, marginLeft: 10, marginRight: 10 }}>sorted by</p>
        <Dropdown overlay={sortedBy} >
          <Button style={{ color: 'black', maxWidth: 350, border: '1px solid black', borderRadius: 4, textAlign: 'left' }}>
            <Icon type='down' />Most Staked
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}
