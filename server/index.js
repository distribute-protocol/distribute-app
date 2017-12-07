const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('HTTP://127.0.0.1:7545'))

eth.accounts().then(accountsArr => {
  console.log(accountsArr)
})
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
