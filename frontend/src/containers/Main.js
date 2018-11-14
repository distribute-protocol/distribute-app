import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Status from './Status'
import Profile from './Profile'
import RoleSelection from './RoleSelection'
import Stake from './1Stake'
import Add from './2Add'
import Claim from './3Claim'
import Validate from './4Validate'
import Vote from './5Vote'
import Complete from './finished/Complete'
import Failed from './finished/Failed'
import Expired from './finished/Expired'
import Landing from './Landing'
import Initiator from './Initiator'
import Finder from './Finder'

const Main = () =>
  <main>
    <Switch>
      <Route exact path='/' component={Landing} />
      <Route path='/status' component={Status} />
      <Route path='/profile' component={Profile} />
      <Route path='/roleselection' component={RoleSelection} />
      <Route path='/initiator' component={Initiator} />
      <Route path='/finder' component={Finder} />
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
