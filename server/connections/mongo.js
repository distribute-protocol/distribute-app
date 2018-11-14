const mongoose = require('mongoose')
const { mongoUrl,
  isProd,
  defaultMongoOptions } = require('../config/env')

// import supervisor from '../../config/supervisor';

mongoose.Promise = global.Promise
mongoose.set('debug', !isProd);

const connect = (uri) => {
  mongoose.connect(uri, defaultMongoOptions);
  mongoose.connection.on('connected', () => { console.log(`Connected to mongo`); });
  mongoose.connection.on('error', (err) => { console.log(err); });
  mongoose.connection.on('disconnected', () => {
    console.log(`Disconnected from mongo`);
  });
  return mongoose.connection;
}

module.exports = connect(mongoUrl);
