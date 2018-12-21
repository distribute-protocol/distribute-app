const oneSecondMS = 1000;

const ganacheUrl = process.env.GANACHE_URL || 'ws://ganache-cli:8545'
const mongoUrl = process.env.MONGODB_URI || 'mongodb://mongo:27017/distribute'
const isProd = process.env.NODE_ENV === 'prod' ? true : false;

const defaultMongoOptions = {
  useNewUrlParser: true,
  autoReconnect: true,
  connectTimeoutMS: 90 * oneSecondMS,
  poolSize: 20,
  reconnectTries: 100,
  reconnectInterval: 5 * oneSecondMS
};


module.exports = {
  isProd,
  mongoUrl,
  defaultMongoOptions,
  ganacheUrl

}
