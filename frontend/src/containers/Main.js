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
import Initiator from './1_initiate/Initiator'
import Finder from './2_find/Finder'
import FinderProjectPage from './2_find/ProjectPage'
import Planner from './3_plan/Planner'
import PlannerProjectPage from './3_plan/ProjectPage'
import Doer from './4_do/Doer'
// import DoerProjectPage from './(4) doer/ProjectPage'
import Validator from './5_validate/Validator'
// import ValidatorProjectPage from './(5) validator/ProjectPage'
import Resolver from './6_resolve/Resolver'
// import ResolverProjectPage from './(6) resolver/ProjectPage'

const Main = () =>
  <main>
    <Switch>
      <Route exact path='/' component={Landing} />
      <Route path='/status' component={Status} />
      <Route path='/profile' component={Profile} />
      <Route path='/fund' component={Fund} />
      <Route path='/roleselection' component={RoleSelection} />
      <Route path='/initiate' component={Initiator} />
      <Route path='/find/project/:id' component={FinderProjectPage} />
      <Route path='/find' component={Finder} />
      <Route path='/plan/project/:id' component={PlannerProjectPage} />
      <Route path='/plan' component={Planner} />
      <Route path='/do' component={Doer} />
      <Route path='/validate' component={Validator} />
      <Route path='/resolve' component={Resolver} />
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
