const oneSecondMS = 1000;

const mongoUrl = 'mongodb://mongo:27017/distribute'
const isProd = process.env.NODE_ENV === 'prod' ? true : false;

const defaultMongoOptions = {
  useNewUrlParser: true,
  autoReconnect: true,
  connectTimeoutMS: 90 * oneSecondMS,
  poolSize: 20,
  reconnectTries: 100,
  reconnectInterval: 5 * oneSecondMS
};

const ganacheUrl = 'ws://ganache-cli:8545'

module.exports = {
  isProd,
  mongoUrl,
  defaultMongoOptions,
  ganacheUrl

}
// process.env.MONGODB_URI ||
