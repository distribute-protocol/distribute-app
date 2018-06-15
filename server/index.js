const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const assert = require('assert')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

mongoose.Promise = global.Promise

const dtLogs = require('./logs/distributeToken')
const rrLogs = require('./logs/reputationRegistry')
const prLogs = require('./logs/projectRegistry')
const user = require('./routes/user')
const status = require('./routes/status')
const project = require('./routes/project')
const schema = require('./data/schema')
const app = express()

app.set('port', process.env.PORT || 3001)

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../frontend/public')))

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/distribute'

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

// connect to mongoose
mongoose.connect(url, (err) => {
  assert.equal(null, err)
  console.log('connected to mongoose')
})

// fire logs --> network model initalized in dtLog ONLY
dtLogs()
rrLogs()
prLogs()

// fire routes
user(app, url)
status(app, url)
project(app, url)

app.listen(app.get('port'), () => {
  console.log(`app listening on port ${app.get('port')}`)
})
