import { web3, eth } from './blockchain'
import { delay } from './delay'

function increaseTime (seconds) {
  web3.currentProvider.sendAsync(
    {
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [seconds],
      id: 0
    }, (err, res) => {
      if (!err) {
        eth.getAccounts(async (err, accounts) => {
          if (!err) {
            web3.eth.sendTransaction({from: accounts[0], to: accounts[0], value: 0}, (err, res) => {
              if (!err) {
                web3.eth.getBlock('latest', (err, res) => {
                  if (!err) {
                    console.log('time after', res.timestamp)
                  }
                })
              }
            })
          }
        })
      }
    }
  )
}

async function waitTime (seconds) {
  let blockNum = await web3.eth.getBlockNumberAsync()
  let block = await web3.eth.getBlockAsync(blockNum)
  const startTime = block.timestamp
  let blockTime = startTime
  while (blockTime - startTime < seconds) {
    await delay(1000)
    blockNum = await web3.eth.getBlockNumberAsync()
    block = await web3.eth.getBlockAsync(blockNum)
    blockTime = block.timestamp
  }
}

function fastForward (seconds) {
  web3.eth.getBlock('latest', (err, res) => {
    if (!err) {
      const netver = web3.version.getNetwork((err, res) => {
        if (!err) {
          if (netver !== '234') {
            return increaseTime(seconds)
          } else {
            return waitTime(seconds)
          }
        }
      })
    }
  })
}

export default fastForward
