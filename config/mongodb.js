const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config()

mongoose.Promise = global.Promise;

mongoose.set('debug', process.env.DEBUG === 'development');

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB Connection Error ${err}`);
});

mongoose.connection.on('connected', () => {
  logger.info('Connected To DB');
});


/**
 * Connect to mongo db
 * @returns {object} Mongoose connection
 * @public
 */
exports.Connect = () => {
  mongoose.connect(process.env.MONGO_CONNECTION);
  return mongoose.connection;
};