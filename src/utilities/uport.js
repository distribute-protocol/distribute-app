import { nemoClientID, nemoPK } from '../private'
import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('Nemo', {
  clientId: nemoClientID,
  network: 'rinkeby',
  signer: SimpleSigner(nemoPK)
})

export default uport
