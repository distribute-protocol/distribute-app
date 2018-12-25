const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const compression = require('compression')
const ngrok = require('ngrok')
// const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')
const { ApolloEngine } = require('apollo-engine')
require('./connections/mongo')

const hypLogs = require('./logs/hyphaToken')
const rrLogs = require('./logs/reputationRegistry')
const prLogs = require('./logs/projectRegistry')
const trLogs = require('./logs/tokenRegistry')
const plLogs = require('./logs/projectLibrary')
const typeDefs = require('./data/typeDefs')
const resolvers = require('./data/resolvers')

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

app.use(compression())
// The GraphQL endpoint
const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cacheControl: true,
  engine: false
  //   // By setting this to "false", we avoid using Apollo Server 2's
  //   // integrated metric reporting and fall-back to using the Apollo
  //   // Engine Proxy (running separately) for metric collection.
  // engine: {
  //   apiKey: ENGINE_API_KEY
  // }
})
server.applyMiddleware({ app })

// fire logs --> network model initalized in dtLog ONLY
hypLogs()
rrLogs()
prLogs()
trLogs()
plLogs()

// let endpoint = ''

engine.listen({
  port: app.get('port'),
  graphqlPaths: ['/api/graphql'],
  expressApp: app,
  launcherOptions: {
    startupTimeout: 3000
  }
}, () => {
  console.log('Listening!')
})
//
// ngrok.connect(8088).then(ngrokUrl => {
//   endpoint = ngrokUrl
//   console.log(`Your dApp is being served!, open at ${endpoint} and scan the QR to login!`)
// })
