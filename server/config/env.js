const oneSecondMS = 1000;

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/distribute'
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
  defaultMongoOptions
}