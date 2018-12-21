const Web3 = require('web3')
const { ganacheUrl } = require('../config/env')
const web3 = new Web3()
web3.setProvider(new Web3.providers.WebsocketProvider(ganacheUrl))
web3.eth.net.isListening()
   .then(() => console.log('is connected'))
   .catch(e => console.log('Wow. Something went wrong'));

// const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl))

module.exports = web3
