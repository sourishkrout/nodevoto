'use strict';

const http = require('http');
const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const logger = require('../../lib/logger');
const app = require('./app');

const WEB_PORT = process.env.WEB_PORT !== undefined ? process.env.WEB_PORT : null;
const EMOJISVC_HOST = process.env.EMOJISVC_HOST !== undefined ? process.env.EMOJISVC_HOST : null;
const VOTINGSVC_HOST = process.env.VOTINGSVC_HOST !== undefined ? process.env.VOTINGSVC_HOST : null;
const INDEX_BUNDLE = process.env.INDEX_BUNDLE !== undefined ? process.env.INDEX_BUNDLE : null;
const WEBPACK_DEV_SERVER = process.env.WEBPACK_DEV_SERVER !== undefined ? process.env.WEBPACK_DEV_SERVER : null;

if (WEB_PORT && EMOJISVC_HOST && VOTINGSVC_HOST) {
  Promise.resolve().then(async() => {
    let emojiClient = createGrpcClient('../../proto/Emoji.proto', 'EmojiService', EMOJISVC_HOST);
    let votingClient = createGrpcClient('../../proto/Voting.proto', 'VotingService', VOTINGSVC_HOST);

    let web = await app.create(WEB_PORT,
      WEBPACK_DEV_SERVER,
      INDEX_BUNDLE,
      await emojiClient,
      await votingClient);
    let server = http.createServer(web);

    logger.info(`Starting web server on WEB_PORT=[${WEB_PORT}]`);
    server.listen(WEB_PORT);
  });
} else {
  logger.error(`WEB_PORT (currently [${WEB_PORT}]) EMOJISVC_HOST (currently [${EMOJISVC_HOST}]) and VOTINGSVC_HOST (currently [${VOTINGSVC_HOST}]) INDEX_BUNDLE (currently [${INDEX_BUNDLE}]) environment variables must me set.`);
  process.exit(1);
}

async function createGrpcClient(proto, svc, host) {
  const PROTO_PATH = path.join(__dirname, proto);

  let descriptor = await protoLoader.load(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

  let pkg = grpc.loadPackageDefinition(descriptor);
  let Service = pkg.emojivoto.v1[svc];

  let client = new Service(host, grpc.credentials.createInsecure());

  return client;
}
