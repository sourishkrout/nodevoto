'use strict';

const path = require('path');
const protoLoader = require('@grpc/proto-loader');

class EmojiServiceServer {
  constructor(emoji) {
    this.emoji = emoji;
  }

  getByShortcode(shortcode) {
    return this.emoji.getByShortcode(shortcode);
  }

  getList() {
    return this.emoji.getList();
  }

  mapRPC() {
    let implementations = {};

    implementations.ListAll = (call, callback) => {
      let results = { list: this.getList() };
      callback(null, results);
    };

    implementations.FindByShortcode = (call, callback) => {
      let emoji = { Emoji: this.getByShortcode(call.request.Shortcode) };
      callback(null, emoji);
    };

    return implementations;
  }
}

module.exports.newGrpcServer = async (grpcServer, emoji) => {
  const PROTO_PATH = path.join(__dirname + '../../../proto/Emoji.proto');

  let descriptor = await protoLoader.load(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

  let emojiSvc = descriptor['emojivoto.v1.EmojiService'];
  let emojiSrv = new EmojiServiceServer(emoji);
  let implementations = emojiSrv.mapRPC();

  grpcServer.addService(emojiSvc, implementations);

  return implementations;
};
