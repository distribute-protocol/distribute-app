const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const dtLogs = require('./logs/dtLogs')

const landingController = require('./controllers/landingController')
const statusController = require('./controllers/statusController')

const app = express()

app.set('port', process.env.PORT || 3001)

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../frontend/public')))

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/distribute'

// connect to mongo
MongoClient.connect(url, (err, client) => {
  assert.equal(null, err)
  console.log('Connected correctly to server.')
  client.close()
})

// fire logs
dtLogs()

// fire controllers
landingController(app, url)
statusController(app, url)

app.listen(app.get('port'), () => {
  console.log(`app listening on port ${app.get('port')}`)
})
