'use strict';

const winston = require('winston');

module.exports = winston.createLogger({
  level: process.env.NODE_ENV !== 'test' ? 'info' : 'error',
  levels: winston.config.syslog.levels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ]
});
