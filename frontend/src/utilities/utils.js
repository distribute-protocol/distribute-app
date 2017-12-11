import Eth from 'ethjs'
const eth = new Eth(window.web3.currentProvider)

const utils = {
  // returns the solidity-sha3 output for VoteMap indexing
  checkTransactionMined: async (txhash) => {
    let txreceipt = await eth.getTransactionReceipt(txhash)
    let mined
    txreceipt.status === 1
    ? mined = true
    : mined = false
    return mined
  }
};

export default utils
