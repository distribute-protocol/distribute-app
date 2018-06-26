const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const assert = require('assert')
const compression = require('compression')
const cors = require('cors')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { ApolloEngine } = require('apollo-engine')
mongoose.Promise = global.Promise

const dtLogs = require('./logs/distributeToken')
const rrLogs = require('./logs/reputationRegistry')
const prLogs = require('./logs/projectRegistry')
const plLogs = require('./logs/projectLibrary')
const trLogs = require('./logs/tokenRegistry')
const schema = require('./data/schema')

const app = express()

app.set('port', process.env.PORT || 3001)
const ENGINE_API_KEY = 'service:distribute1000:kJ_c9KYFatDESVsmhHL-4w'

const engine = new ApolloEngine({
  apiKey: ENGINE_API_KEY
})

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../frontend/public')))

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/distribute'

app.use(compression())
// The GraphQL endpoint
app.use('/graphql', cors(), bodyParser.json(), graphqlExpress({ schema, tracing: true, cacheControl: true }))

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
plLogs()
trLogs()

engine.listen({
  port: app.get('port'),
  expressApp: app
})
// app.listen(app.get('port'), () => {
//   console.log(`app listening on port ${app.get('port')}`)
// })
