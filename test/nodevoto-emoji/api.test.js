'use strict';
const api = require('../../services/nodevoto-emoji/api');
const Emoji = require('../../services/nodevoto-emoji/Emoji');

const grpc = require('grpc');

const expect = require('chai').expect;

const wrap = (func) => {
  return () => {
    return new Promise((res, rej) => {
      func(null, (err, val) => {
        if (err) {
          return rej(err);
        } else {
          return res(val);
        }
      });
    });
  };
};

describe('api', () => {
  let impls;

  beforeEach(async() => {
    const server = new grpc.Server();
    const emoji = new Emoji();

    impls = await api.newGrpcServer(server, emoji);
  });

  describe('#newGrpcServer', () => {
    it('should return implemenations of RPC operations', async() => {

      expect(Object.entries(impls).length).equals(2);
      expect(impls.ListAll).not.equal(null);
      expect(impls.FindByShortcode).not.equal(null);
    });

  });

});
