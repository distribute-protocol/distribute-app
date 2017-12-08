const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('http://localhost:7545'))
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))


eth.accounts().then(accountsArr => {
  console.log(accountsArr)
})

//
const filter = web3.eth.filter({
  fromBlock: 0,
  toBlock: 'latest',
  //address is totalCapitalTokenAddress from ../src/abi/TokenHolderRegistry.js
  address: '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f',
  topics: [web3.sha3('LogProposal(uint256,uint256)')]
})

filter.watch((error, result) => {
   console.log(result)
})
//


const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../frontend/build')))

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/distribute'

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'))
})

app.set('port', process.env.PORT || 3001)

app.listen(app.get('port'), () => {
  console.log(`app listening on port ${app.get('port')}`)
})
