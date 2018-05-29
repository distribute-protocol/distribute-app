const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const assert = require('assert')

const dtLogs = require('./logs/distributeToken')

const user = require('./routes/user')
const status = require('./routes/status')

const app = express()

app.set('port', process.env.PORT || 3001)

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../frontend/public')))

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/distribute'

// connect to mongoose
mongoose.connect(url, (err) => {
  assert.equal(null, err)
  console.log('connected to mongoose')
})

// fire logs
dtLogs()

// fire routes
user(app, url)
status(app, url)

app.listen(app.get('port'), () => {
  console.log(`app listening on port ${app.get('port')}`)
})
