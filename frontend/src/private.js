export const nemoClientID = '2oqNQxEfeM6M9BXTo12M7YNQFj2ByaZ6YvB'
export const nemoPK = '48c8577021d267d66fd52aa71ea49cbf2af895f815bfe09457347a6664b1ada7'
export const nemoPubKey = '0x04b83fca2900876947e89df89e78b0d2a687e15912d0a965889fb8967842371e2f83a4dae2d3e393bc38a1f8bd728bf0852346b7193c4468a2d65259781424a44c'

    //
    // import { Connect, SimpleSigner } from 'uport-connect'
    //
    // const uport = new Connect('Nemo', {
    //   clientId: '2oqNQxEfeM6M9BXTo12M7YNQFj2ByaZ6YvB',
    //   network: 'rinkeby or ropsten or kovan',
    //   signer: SimpleSigner('48c8577021d267d66fd52aa71ea49cbf2af895f815bfe09457347a6664b1ada7')
    // })
    //
    // // Request credentials to login
    // uport.requestCredentials({
    //   requested: ['name', 'phone', 'country'],
    //   notifications: true // We want this if we want to recieve credentials
    // })
    // .then((credentials) => {
    //   // Do something
    // })
    //
    // // Attest specific credentials
    // uport.attestCredentials({
    //   sub: THE_RECEIVING_UPORT_ADDRESS,
    //   claim: {
    //     CREDENTIAL_NAME: CREDENTIAL_VALUE
    //   },
    //   exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    // })
