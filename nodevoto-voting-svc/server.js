'use strict';

const api = require('./lib/api');
const grpc = require('grpc');
const Poll = require('./lib/Poll');
const logger = require('./lib/logger');

const GRPC_PORT = process.env.GRPC_PORT !== 'undefined' ? process.env.GRPC_PORT : null;

if (GRPC_PORT) {
  const server = new grpc.Server();
  const poll = new Poll();

  api.NewGrpcServer(server, poll).then(() => {
    server.bind(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure());
    logger.info(`Starting grpc server on GRPC_PORT=[${GRPC_PORT}]`);
    server.start();
  });

} else {
  logger.error(`GRPC_PORT (currently [${GRPC_PORT}]) environment variable must me set to run the server.`);
  process.exit(1);
}
