import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Status from './Status'
import Profile from './Profile'
import RoleSelection from './RoleSelection'
// import Stake from './1Stake'
// import Add from './2Add'
// import Claim from './3Claim'
// import Validate from './4Validate'
// import Vote from './5Vote'
// import Complete from './finished/Complete'
// import Failed from './finished/Failed'
// import Expired from './finished/Expired'
import Landing from './Landing'
import Fund from './Fund'
import Initiator from './(1) initiator/Initiator'
import Finder from './(2) finder/Finder'
import FinderProjectPage from './(2) finder/ProjectPage'
import Planner from './(3) planner/Planner'
import PlannerProjectPage from './(3) planner/ProjectPage'
import Doer from './(4) doer/Doer'
// import DoerProjectPage from './(4) doer/ProjectPage'
import Validator from './(5) validator/Validator'
// import ValidatorProjectPage from './(5) validator/ProjectPage'
import Resolver from './(6) resolver/Resolver'
// import ResolverProjectPage from './(6) resolver/ProjectPage'

const Main = () =>
  <main>
    <Switch>
      <Route exact path='/' component={Landing} />
      <Route path='/status' component={Status} />
      <Route path='/profile' component={Profile} />
      <Route path='/fund' component={Fund} />
      <Route path='/roleselection' component={RoleSelection} />
      <Route path='/initiator' component={Initiator} />
      <Route path='/finder/project/:id' component={FinderProjectPage} />
      <Route path='/finder' component={Finder} />
      <Route path='/planner/project/:id' component={PlannerProjectPage} />
      <Route path='/planner' component={Planner} />
      <Route path='/doer' component={Planner} />
      <Route path='/validator' component={Planner} />
      <Route path='/resolver' component={Planner} />
      {/*
      // <Route path='/stake' component={Stake} />
      // <Route path='/add' component={Add} />
      // <Route path='/claim' component={Claim} />
      // <Route path='/validate' component={Validate} />
      // <Route path='/vote' component={Vote} />
      // <Route path='/complete' component={Complete} />
      // <Route path='/failed' component={Failed} />
      // <Route path='/expired' component={Expired} /> */}

    </Switch>
  </main>

export default Main
