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
    margin: 50,
    marginBottom: 15
  },
  buttonStyle: {
    backgroundColor: brandColor,
    color: white,
    height: 50,
    width: 180,
    alignSelf: 'flex-start',
    marginLeft: 250,
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
      <div style={{ display: 'flex', flexDirection: 'row', height: '75vh', marginTop: 30, flexWrap: 'wrap', marginLeft: 100, marginRight: 100 }}>
        <div style={{ minWidth: 400, minHeight: 500, marginRight: '2%', width: '42.29166667%', height: '100%', justifyContent: 'flex-end', display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', backgroundImage: `url(${mesh})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
          <p style={styles.textBox}>
            The Equitable Internet Initiative is building a local Internet Service Provider (ISP)
            to service communities that don't have access.
          </p>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '2%', height: '100%', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%', height: '50%', marginBottom: '3.90625%', backgroundImage: `url(${farm})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <p style={styles.textBox}>
              Urban Tilth is teaching farming in their community to increase the resiliency of their neighborhood.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%', height: '50%', backgroundImage: `url(${solar})`, backgroundRepeat: 'no-repeats', backgroundSize: 'cover' }}>
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
