'use strict';

const winston = require('winston');

module.exports = winston.createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  levels: winston.config.syslog.levels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ]
});
