'use strict';
const expect = require('chai').expect;
const Gif = require('../../services/nodevoto-emoji/Gif');
const gifCodeMap = require('../../lib/gif_codemap.json');

describe('Gif', () => {
  let gif;
  beforeEach(async() => {
    gif = new Gif();
  });

  describe('#getByShortcode', () => {

    it('should return VoteLoveArtCute for specific shortcode', async() => {
      let _em = gif.getByShortcode(':love-art-cute-l0HU2sYgCZh3HiKnS:');

      expect(_em.unicode).equals('https://media1.giphy.com/media/l0HU2sYgCZh3HiKnS/100w.gif');
      expect(_em.shortcode).equals(':love-art-cute-l0HU2sYgCZh3HiKnS:');
    });

    it('should return null when shortcode does not match entries', async() => {
      let _ems = [':non_existent:', ':made_up:',
        ':nobody_here:', ':kthxbai:'].map(gif.getByShortcode.bind(gif));

      _ems.map(_em => {
        expect(_em).equal(null);
      });
    });

  });

  describe('#getList', () => {

    it('should return a list of all gifs', async() => {
      let results = gif.getList();

      expect(results).not.equal(null);
      expect(results[10].unicode).equal('https://media1.giphy.com/media/3o7absbD7PbTFQa0c8/100w.gif');
      expect(results[10].shortcode).equal(':spongebob-cartoon-nickelodeon-thumbs-3o7absbD7PbTFQa0c8:');
      expect(results.length).equal(88);
    });

    it('should have all gif from the generated code map', async() => {
      let all = new Set(gif.getList());
      let gifMap = new Map();

      all.forEach(_em => {
        gifMap.set(_em.unicode, true);
      });

      let res = gif.topGif.map(code => {
        return gifMap.has(gifCodeMap[code].src);
      }).reduce((prev, curr) => { return prev && curr; }, true);

      expect(res).equals(true);
    });

    it('should be free of duplicate gif.', async() => {
      let list = gif.getList();

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
