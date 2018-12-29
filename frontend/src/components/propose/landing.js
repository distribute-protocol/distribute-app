import React from 'react'
import { Button } from 'antd'
import { font1 } from '../../styles/fonts'
import { white, brandColor } from '../../styles/colors'
import farm from '../../images/initiator/farm.png'
import mesh from '../../images/initiator/mesh.png'
import solar from '../../images/initiator/solar.png'

const styles = {
  heading: {
    fontSize: 32,
    fontFamily: font1,
    marginTop: 50
  },
  buttonStyle: {
    backgroundColor: brandColor,
    color: white,
    height: 50,
    width: 180,
    alignSelf: 'flex-start',
    marginLeft: 345,
    fontSize: 20,
    fontFamily: font1,
    textAlign: 'center',
    borderColor: brandColor
  },
  textBox: {
    backgroundColor: 'white',
    margin: 20,
    padding: 10
  }
}
export default (props) => {
  return (
    <div style={{ marginLeft: 100, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={styles.heading}>
        Contribute your best ideas to your community and the world.
      </h1>
      <Button onClick={props.chooseResource} style={styles.buttonStyle}>
        Initiate project
      </Button>
      <div style={{ display: 'flex', flexDirection: 'row', height: '75vh', marginTop: 30 }}>
        <div style={{ width: 609, justifyContent: 'flex-end', display: 'flex', flex: 2, marginRight: 20, alignItems: 'center', flexDirection: 'column', backgroundImage: `url(${mesh})` }}>
          <p style={styles.textBox}>
            The Equitable Internet Initiative is building a local Internet Service Provider (ISP)
            to service communities that don't have access.
          </p>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: 540, height: 330, marginBottom: 20, backgroundImage: `url(${farm})`, backgroundRepeat: 'no-repeat' }}>
            <p style={styles.textBox}>
              Urban Tilth is teaching farming in their community to increase the resiliency of their neighborhood.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: 540, height: 330, marginTop: 20, backgroundImage: `url(${solar})`, backgroundRepeat: 'no-repeat' }}>
            <p style={styles.textBox}>
              Urban Tilth is teaching farming in their community to increase the resiliency of their neighborhood.
            </p>
          </div>
          {/* <img src={farm} style={{ flex: 1, marginLeft: 30, marginBottom: 15, height: 350 }} /> */}
          {/* <img src={solar} style={{ flex: 1,  marginLeft: 30, marginTop: 15, height: 350 }} /> */}
        </div>
      </div>
    </div>
  )
}
