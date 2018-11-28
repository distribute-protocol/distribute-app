// import { distributeClientID, distributePK } from '../private'
import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('distribute')
  /*, {
  clientId: distributeClientID,
  network: 'rinkeby'
  // signer: SimpleSigner(distributePK)
})*/

export default uport
