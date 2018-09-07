'use strict';
const api = require('../../services/nodevoto-emoji/api');
const Emoji = require('../../services/nodevoto-emoji/Emoji');

const grpc = require('grpc');

const expect = require('chai').expect;

const wrap = (func) => {
  return (arg) => {
    return new Promise((res, rej) => {
      func(arg, (err, val) => {
        if (err) {
          return rej(err);
        } else {
          return res(val);
        }
      });
    });
  };
};

const wrapArg = (arg) => {
  return { 'request': { 'Shortcode': arg } };
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

  describe('implementation', () => {

    it('should return all emojis when ListAll is called', async() => {
      let response = await wrap(impls.ListAll)();

      expect(response.list.length).equals(100);

      expect(response.list[5].unicode).equals('🤑');
      expect(response.list[5].shortcode).equals(':money_mouth_face:');
    });

    it('should return emoji for valid shortcode', async() => {
      let findByShortcode = wrap(impls.FindByShortcode);
      let found = (await findByShortcode(wrapArg(':money_mouth_face:'))).Emoji;

      expect(found).not.to.equal(null);
      expect(found.unicode).equals('🤑');
      expect(found.shortcode).equals(':money_mouth_face:');
    });

    it('should find emojis for all shortcodes', async() => {
      let list = (await wrap(impls.ListAll)()).list;
      let findByShortcode = wrap(impls.FindByShortcode);

      let all = list.map(emoji => {
        return findByShortcode(wrapArg(emoji.shortcode)).then(found => {
          return found.Emoji.unicode === emoji.unicode
            && found.Emoji.shortcode === emoji.shortcode;
        });
      });

      let res = (await Promise.all(all)).reduce((prev, curr) => {
        return prev && curr;
      }, true);

      expect(res).equals(true);
    });

    it('should return null if it cannot find shortcode', async() => {
      let findByShortcode = wrap(impls.FindByShortcode);
      let found = await findByShortcode(wrapArg(':not_available:'));

      expect(found.Emoji).equals(null);
    });

  });

});
