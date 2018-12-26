// import { distributeClientID, distributePK } from '../private'
import { Connect } from 'uport-connect'

const uport = new Connect('Hypha')
/*
, {
  clientId: distributeClientID,
  network: 'rinkeby'
  // signer: SimpleSigner(distributePK)
})
*/

export default uport
