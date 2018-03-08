export const distributeClientID = '2p2Aubzc3fupyN9KZ4iQ81Ta8wbeT1WrsFj'
export const distributePK = 'd4a2a2a813f0c078718767e43d2e7f401bb30c1b4e63ec1beecfdfa2e3959295'
export const distributePubKey = '0x0499ff131711332bbfa267825795fc268907689613b20d2ff89d9a2266e59b1f12bccb350a25f670239d5f51978e88599f0e280335adbf4f9ea293f499c031064f'

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
