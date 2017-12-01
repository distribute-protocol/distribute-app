// // import React, { Component } from 'react'
// // import { TokenHolderRegistryABI, TokenHolderRegistryAddress, TokenHolderRegistryBytecode } from '../abi/TokenHolderRegistry'
// // import { WorkerRegistryABI, WorkerRegistryAddress, WorkerRegistryBytecode } from '../abi/WorkerRegistry'
// // import Eth from 'ethjs'
// // import uport from '../utilities/uport'
// // var mnid = require('mnid')
// // const eth = new Eth(window.web3.currentProvider)
// //
// // let uportWR = uport.contract(JSON.parse(WorkerRegistryABI)).at(WorkerRegistryAddress)
// // window.uportWR = uportWR
// //
// // class App extends Component {
// //   constructor () {
// //     super()
// //     this.state = {}
// //     this.THR = eth.contract(JSON.parse(TokenHolderRegistryABI), TokenHolderRegistryBytecode)
// //     this.WR = eth.contract(JSON.parse(WorkerRegistryABI), WorkerRegistryBytecode)
// //     this.thr = this.THR.at(TokenHolderRegistryAddress)
// //     this.wr = this.WR.at(WorkerRegistryAddress)
// //     this.uportWR = uport.contract(JSON.parse(WorkerRegistryABI)).at(WorkerRegistryAddress)
// //     this.uportTHR = uport.contract(JSON.parse(TokenHolderRegistryABI)).at(TokenHolderRegistryAddress)
// //     this.buyShares = this.buyShares.bind(this)
// //     this.sellShares = this.sellShares.bind(this)
// //     this.getBalance = this.getBalance.bind(this)
// //     this.login = this.login.bind(this)
// //   }
// //   login () {
// //     uport.requestCredentials({
// //       requested: ['name', 'avatar'],
// //       notifications: true
// //     }).then((credentials) => {
// //       console.log(credentials)
// //       console.log(mnid.decode(credentials.address))
// //       // this.uportWR.register()/
// //       // https://rinkeby.infura.io/11XiCuI1EjsowYvplZ24
// //       // const txobject = {
// //       //   to: '0xeec918d74c746167564401103096d45bbd494b74',
// //       //   function: WR.register(),
// //       //   appName: 'Nemo'
// //       // }
// //       // uport.sendTranaction(txobject).then(txID => console.log(txID))
// //       // WR.register()
// //     })
// //   }
// //   componentWillMount () {
// //     this.getBalance()
// //   }
// //   getBalance () {
// //     eth.accounts().then(accountsArr => {
// //       this.thr.balanceOf(accountsArr[0]).then((balance) => {
// //         this.setState({balance: balance[0]['words'][0]})
// //       })
// //     })
// //   }
// //   buyShares () {
// //     let thr = this.uportTHR
// //     eth.accounts().then(accountsArr => {
// //       thr.mint(700, {value: Eth.toWei(1, 'ether'), from: accountsArr[0]})
// //       this.getBalance()
// //     })
// //   }
// //   sellShares () {
// //     let thr = this.thr
// //     eth.accounts().then(accountsArr => {
// //       thr.burnAndRefund(700, {from: accountsArr[0]})
// //       this.getBalance()
// //     })
// //   }
// //   render () {
// //     return (
// //       <div className='App' style={{height: '100%', width: '100%'}}>
//
// //
// //         </div>
// //         {/* <div style={{display: 'flex', height: '100%', justifyContent: 'flex-start', flexDirection: 'horizontal'}}>
// //
// //         </div> */}
// //         {/* <div onClick={this.login} style={{width: 90, height: 30, padding: 20, margin: 10, backgroundColor: 'purple'}}>
// //           Connect with uPort
// //         </div>
// //         <div style={{display: 'flex', justifyContent: 'center'}}>
// //           <div style={{backgroundColor: 'blue', color: 'white', width: 90, padding: 20, margin: 10}} onClick={this.buyShares}>
// //             Buy Shares
// //           </div>
// //
// //           <div style={{backgroundColor: 'red', color: 'white', width: 90, padding: 20, margin: 10}} onClick={this.sellShares}>
// //             Sell Shares
// //           </div>
// //           <div style={{backgroundColor: 'teal', color: 'black', width: 90, padding: 20, margin: 10}} onClick={this.getBalance}>
// //             {`Current shares: ${this.state.balance}`}
// //           </div>
// //         </div> */}
// //       </div>
// //     )
// //   }
// // }
// //
// // const styleSheet = {
// //   actionText: {
// //
// //   },
// //     height: '100%', /* 100% Full-height */
// //     // width: 0, /* 0 width - change this with JavaScript */
// //     position: 'fixed', /* Stay in place */
// //     'zIndex': 1, /* Stay on top */
// //     top: 0, /* Stay at the top */
// //     left: 0, /* Black*/
// //     // overflowX: 'hidden', /* Disable horizontal scroll */
// //     paddingTop: '60px', /* Place content 60px from the top */
// //     transition: 0.5, /* 0.5 second transition effect to slide in the sidenav */
// // }
// // export default App
//
// import React from 'react'
// import { Switch, Route } from 'react-router-dom'
// // import Home from './Home'
// import Status from './Status'
// // import Profiles from './Profiles/index'
// // import MapView from './MapView'
// // import Circles from './Circles'
// // import Services from './Services/index'
//
// const Main = () =>
//   <main>

//     <Switch>
//       <Route exact path='/' component={Status} />
//       {/* <Route path='/home' component={Home} />
//       <Route path='/profiles' component={Profiles} />
//       <Route path='/map' component={MapView} />
//       <Route path='/circles' component={Circles} />
//       <Route path='/mpi' component={Services} /> */}
//     </Switch>
//   </main>
//
// export default Main

import React from 'react'
import { Switch, Route } from 'react-router-dom'
// import Home from './Home'
// import Landing from './Landing'
// import Profiles from './Profiles/index'
// import MapView from './MapView'
// import Circles from './Circles'
// import Services from './Services/index'

const Main = () =>
  <main>
    <Switch>
      <Route exact path='/' component={<div></div>} />
      {/* <Route path='/home' component={Home} />
      <Route path='/profiles' component={Profiles} />
      <Route path='/map' component={MapView} />
      <Route path='/circles' component={Circles} />
      <Route path='/mpi' component={Services} /> */}
    </Switch>
  </main>

export default Main
