import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Status from './Status'
import CurrentProjects from './CurrentProjects'
import Propose from './Propose'
import Stake from './Stake'
import Claim from './Claim'
import Validate from './Validate'
import Vote from './Vote'
// import Landing from './Landing'
// import Profiles from './Profiles/index'
// import MapView from './MapView'
// import Circles from './Circles'
// import Services from './Services/index'
const Main = () =>
  <main>
    <div style={{height: '100vh', width: 200, backgroundColor: '#111111', position: 'fixed', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: 100, height: 100, borderRadius: 50, backgroundColor: '#fcfcfc', marginTop: 30}}>
      </div>
      <h3 style={{color: '#FCFCFC'}}>Yelnif Akohsa</h3>
      <div style={{alignItems: 'flex-start', marginTop: 30}}>
        <a href='/status'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Status</h3></a>
        <a href='/projects'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Current Projects</h3></a>
        <a href='/propose'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Propose</h3></a>
        <a href='/stake'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Stake</h3></a>
        <a href='/claim'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Claim</h3></a>
        <a href='/validate'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Validate</h3></a>
        <a href='/vote'><h3 className='ActionText' style={{color: '#FCFCFC', marginTop: 10, fontSize: 20, fontFamily: 'helvetica'}}>Vote</h3></a>
      </div>
    </div>
    <Switch>
    <Route exact path='/' component={Status} />
      <Route path='/status' component={Status} />
      <Route path='/projects' component={CurrentProjects} />
      <Route path='/propose' component={Propose} />
      <Route path='/stake' component={Stake} />
      <Route path='/claim' component={Claim} />
      <Route path='/validate' component={Validate} />
      <Route path='/vote' component={Vote} />
    </Switch>
  </main>

export default Main
