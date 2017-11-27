import { Connect, SimpleSigner } from 'uport-connect'

// These are examples we would set the keys for mesh.ly/peterproject later and not include them in the git history
export const nemoClientID = '2oqNQxEfeM6M9BXTo12M7YNQFj2ByaZ6YvB'
export const nemoPK = '48c8577021d267d66fd52aa71ea49cbf2af895f815bfe09457347a6664b1ada7'
export const nemoPubKey = '0x04b83fca2900876947e89df89e78b0d2a687e15912d0a965889fb8967842371e2f83a4dae2d3e393bc38a1f8bd728bf0852346b7193c4468a2d65259781424a44c'

const uport = new Connect('Nemo', {
  clientId: nemoClientID,
  network: 'rinkeby',
  signer: SimpleSigner(nemoPK)
})

export default uport
