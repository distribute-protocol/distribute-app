import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Status from './Status'
// import CurrentProjects from './CurrentProjects'
import Propose from './Propose'
import Stake from './Stake'
import Claim from './Claim'
import Add from './Add'
import Validate from './Validate'
import Vote from './Vote'
import Complete from './finished/Complete'
import Failed from './finished/Failed'
import Expired from './finished/Expired'
import Landing from './Landing'

const Main = () =>
  <main>
    <Switch>
      <Route exact path='/' component={Landing} />
      <Route path='/status' component={Status} />
      {/* <Route path='/projects' component={CurrentProjects} /> */}
      <Route path='/propose' component={Propose} />
      <Route path='/stake' component={Stake} />
      <Route path='/add' component={Add} />
      <Route path='/claim' component={Claim} />
      <Route path='/validate' component={Validate} />
      <Route path='/vote' component={Vote} />
      <Route path='/complete' component={Complete} />
      <Route path='/failed' component={Failed} />
      <Route path='/expired' component={Expired} />
    </Switch>
  </main>

export default Main
