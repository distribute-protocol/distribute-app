import React from 'react'
import { Avatar } from 'antd'
import { connect } from 'react-redux'

const Sidebar = (props) => {
  console.log(props.user)
  return (
    <div style={{height: '100vh', width: 200, backgroundColor: '#111111', position: 'fixed', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1 className='App-title' style={{color: 'white', marginTop: 20}}>distribute</h1>
      <div style={{width: 100, height: 100, borderRadius: 50, backgroundColor: '#fcfcfc', marginTop: 20}}>
        <img style={{width: 100, height: 100, borderRadius: 50}} src={typeof props.user.avatar !== 'undefined' ? props.user.avatar.uri : ''} />
      </div>
      <h3 style={{color: '#FCFCFC', marginTop: 15}}>{props.user.name}</h3>
      <div style={{alignItems: 'flex-start', marginTop: 20}}>
        <a href='/status'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Status</h3></a>
        {/* <a href='/projects'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Current Projects</h3></a> */}
        <a href='/propose'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Propose Projects</h3></a>
        <a href='/stake'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Stake</h3></a>
        <a href='/add'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Add Tasks</h3></a>
        <a href='/claim'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Claim Tasks</h3></a>
        <a href='/validate'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Validate</h3></a>
        <a href='/vote'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Vote</h3></a>
        <a href='/complete'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Complete</h3></a>
        <a href='/failed'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Failed</h3></a>
        <a href='/expired'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Expired</h3></a>
      </div>
    </div>)
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps)(Sidebar)
