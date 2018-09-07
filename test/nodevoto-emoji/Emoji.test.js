'use strict';
const expect = require('chai').expect;
const Emoji = require('../../services/nodevoto-emoji/Emoji');

describe('Emoji', () => {
  let emoji;
  beforeEach(async() => {
    emoji = new Emoji();
  });

  describe('#getByShortcode', () => {

    it('should return one entry for specific shortcode', async() => {
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

  });

});
