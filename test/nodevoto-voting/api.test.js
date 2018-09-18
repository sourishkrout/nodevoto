'use strict';
const api = require('../../services/nodevoto-voting/api');
const Poll = require('../../services/nodevoto-voting/Poll');

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

describe('api (voting)', () => {
  let impls;

  beforeEach(async() => {
    const server = new grpc.Server();
    const poll = new Poll();

    impls = await api.newGrpcServer(server, poll);
  });

  describe('#newGrpcServer', () => {
    it('should return implemenations of RPC operations', async() => {

      expect(Object.entries(impls).length).equals(86);
      expect(impls.VoteMusicchoiceCuteExcited).not.equal(null);
      expect(impls.VoteFacethetruthtv).not.equal(null);
      expect(impls.VoteLego).not.equal(null);
      expect(impls.Results).not.equal(null);
    });

  });

  describe('implementation', () => {

    it('should return error when VoteMusicchoiceCuteExcited is called', async() => {
      try {
        await wrap(impls.VoteMusicchoiceCuteExcited)();
      } catch(err) {
        expect(err.message).equals('Unkown error');
      }
    });

    it('should relay two votes to Poll when VoteLego is called twice', async() => {
      await wrap(impls.VoteLego)();
      await wrap(impls.VoteLego)();
      let response = await wrap(impls.Results)();

      expect(response.results).not.equal(null);
      expect(response.results.length).greaterThan(0);
      expect(response.results[0].Shortcode).equals(':lego-l4q7VhGsL6BnXJrc4:');
      expect(response.results[0].Votes).equals(2);
    });

    it('should return an ordered list when Results is called', async() => {
      let cbs = ['VoteSza', 'VoteJustviralnetFunnyKid', 'VoteDanceBeyonce',
        'VoteHeyviolet', 'VoteJustviralnetFunnyKid', 'VoteDanceBeyonce', 'VoteJustviralnetFunnyKid',
        'VoteDanceBeyonce', 'VoteReactionMood', 'VoteHeyviolet', 'VoteSza',
        'VoteThephizzogs', 'VoteJustviralnetFunnyKid'].map(op => {
        wrap(impls[op])();
      });

      await Promise.all(cbs);
      let response = await wrap(impls.Results)();

      expect(response.results).not.equal(null);
      expect(response.results.length).equals(6);

      expect(response.results[0].Shortcode).equal(':justviralnet-funny-kid-5ZZSYqvcH6QppFQGI5:');
      expect(response.results[0].Votes).equal(4);
      expect(response.results[5].Shortcode).equal(':thephizzogs-l3q2VIWn4W0z1rfos:');
      expect(response.results[5].Votes).equal(1);
    });
  });

});
