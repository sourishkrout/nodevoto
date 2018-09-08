'use strict';
const expect = require('chai').expect;
const Emoji = require('../../services/nodevoto-emoji/Emoji');
const emojiCodeMap = require('../../lib/emoji_codemap.json');

describe('Emoji', () => {
  let emoji;
  beforeEach(async() => {
    emoji = new Emoji();
  });

  describe('#getByShortcode', () => {

    it('should return skull&crossbones for specific shortcode', async() => {
      let _em = emoji.getByShortcode(':skull_and_crossbones:');

      expect(_em.unicode).equals('☠️');
      expect(_em.shortcode).equals(':skull_and_crossbones:');
    });

    it('should return null when shortcode does not match entries', async() => {
      let _ems = [':non_existent:', ':made_up:',
        ':nobody_here:', ':kthxbai:'].map(emoji.getByShortcode.bind(emoji));

      _ems.map(_em => {
        expect(_em).equal(null);
      });
    });

  });

  describe('#getList', () => {

    it('should return a list of all emojis', async() => {
      let results = emoji.getList();

      expect(results).not.equal(null);
      expect(results[10].unicode).equal('\u2620\ufe0f');
      expect(results[10].shortcode).equal(':skull_and_crossbones:');
      expect(results.length).equal(100);
    });

    it('should have all emoji from the generated code map', async() => {
      let all = new Set(emoji.getList());
      let emojiMap = new Map();

      all.forEach(_em => {
        emojiMap.set(_em.unicode, true);
      });

      let res = emoji.top100Emoji.map(code => {
        return emojiMap.has(emojiCodeMap[code]);
      }).reduce((prev, curr) => { return prev && curr; }, true);

      expect(res).equals(true);
    });

    it('should be free of duplicate emoji.', async() => {
      let list = emoji.getList();

      let counted = list.reduce((prev, curr) => {
        let count = prev.get(curr.unicode) || 0;
        prev.set(curr.unicode, ++count);
        return prev;
      }, new Map());

      let dups = [];
      for(let [k,v] of counted) {
        if (v > 1) {
          dups.push(k);
        }
      }

      expect(dups.length).lte(0);
    });

  });

});
