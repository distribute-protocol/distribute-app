const Web3 = require('web3')
const { ganacheUrl } = require('../config/env')
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl))

module.exports = web3
