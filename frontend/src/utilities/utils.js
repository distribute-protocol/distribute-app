import {eth} from './blockchain'

const utils = {
  // returns the solidity-sha3 output for VoteMap indexing
  checkTransactionMined: async (txhash) => {
    let txreceipt = await eth.getTransactionReceipt(txhash, (err, res) => {
    // if txreceipt.status === 1 the tx has been mined
      if (!err) {
        // return txreceipt.status === 1
        return txreceipt.status
      }
    })
  }
}

export default utils
