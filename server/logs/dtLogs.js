const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'))
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const DT = require('../../frontend/src/abi/DistributeToken')
const fetch = require('node-fetch')

module.exports = function () {
  // filter for minting events
  eth.accounts().then(accountsArr => {
    console.log('accountsArr:', accountsArr)
  })

  const serverUrl = 'http://localhost:3001'

  const filter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: DT.DistributeTokenAddress,
    topics: [web3.sha3('LogMint(uint256,uint256)')]
  })

  filter.watch(async (error, result) => {
    if (error) console.error(error)
    let eventParams = result.data
    let eventParamArr = eventParams.slice(2).match(/.{1,64}/g)
    let tokensMinted = eventParamArr[0]
    // convert result from hex to decimal
    tokensMinted = parseInt(tokensMinted, 16)
    console.log(tokensMinted)
    let config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    let address = '2oviuJhgy5PmF5tK4pNzGjakdjamTqnBNkV'
    await fetch(`${serverUrl}/api/mint?address=${address}&value=${tokensMinted}`, config)
  })
}