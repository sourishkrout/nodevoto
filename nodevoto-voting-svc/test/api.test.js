'use strict';
const api = require('../lib/api');
const Poll = require('../lib/Poll');

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
    const poll = new Poll();

    impls = await api.newGrpcServer(server, poll);
  });

  describe('#newGrpcServer', () => {
    it('should return implemenations of RPC operations', async() => {

      expect(Object.entries(impls).length).equals(101);
      expect(impls.VotePoop).not.equal(null);
      expect(impls.VoteBulb).not.equal(null);
      expect(impls.VoteRamen).not.equal(null);
      expect(impls.Results).not.equal(null);
    });

  });

  describe('implementation', () => {

    it('should return error when VotePoop is called', async() => {
      try {
        await wrap(impls.VotePoop)();
      } catch(err) {
        expect(err).equals('Unkown error');
      }
    });

    it('should relay two votes to Poll when VoteRamen is called twice', async() => {
      await wrap(impls.VoteRamen)();
      await wrap(impls.VoteRamen)();
      let response = await wrap(impls.Results)();

      expect(response.results).not.equal(null);
      expect(response.results.length).greaterThan(0);
      expect(response.results[0].Shortcode).equals(':ramen:');
      expect(response.results[0].Votes).equals(2);
    });

    it('should return an ordered list when Results is called', async() => {
      let cbs = ['VotePray', 'VoteRainbow', 'VoteSkier',
        'VoteDog', 'VoteDog', 'VoteSkier', 'VoteRainbow',
        'VoteSkier', 'VoteCallMeHand', 'VoteDog', 'VotePray',
        'VotePrincess', 'VoteRainbow'].map(op => {
        wrap(impls[op])();
      });

      await Promise.all(cbs);
      let response = await wrap(impls.Results)();

      expect(response.results).not.equal(null);
      expect(response.results.length).equals(6);

      expect(response.results[0].Shortcode).equal(':rainbow:');
      expect(response.results[0].Votes).equal(3);
      expect(response.results[5].Shortcode).equal(':princess:');
      expect(response.results[5].Votes).equal(1);
    });
  });

});
