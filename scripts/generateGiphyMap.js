'use strict';

const GIPHY_KEY = process.env['GIPHY_KEY'];
const giphiApiURL = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=500&rating=G`;

const _superagent = require('superagent');
const logger = require('../lib/logger');
const path = require('path');
const util = require('util');

const superget = util.promisify(_superagent.get);
const writeFile = util.promisify(require('fs').writeFile);

let generate;

module.exports = generate = () => {
  logger.info(`Fetching gifs from ${giphiApiURL} via HTTP...`);
  superget(giphiApiURL).then(response => {
    return JSON.parse(response.text);
  }).then(gifs => {
    return gifs.data.filter(gif => {
      return gif.images !== undefined
        && gif.images.fixed_width_small !== undefined
        && gif.images.fixed_width_small.url !== ''
        && gif.title !== '';
    });
  }).then(filtered => {
    logger.info(`Parsed ${filtered.length} gifs from.`);
    let es = new Map();
    filtered.map(gif => {
      es.set(gif.slug, {
        'title': gif.title,
        'src': gif.images.fixed_width_small.url
      });
      return es;
    });
    return es;
  }).then(map => {
    let list = {};
    for (let [k, v] of map) {
      list[`:${k}:`] = v;
    }
    return list;
  }).then(list => {
    let outFile = path.join(__dirname, '../lib/gif_codemap.json');
    logger.info(`Writing flat gif list to ${outFile}.`);
    return writeFile(outFile, JSON.stringify(list, null, 1));
  }).then(() => {
    logger.info(`Success. Bye.`);
  }).catch(err => {
    logger.error(err);
  });
};

generate();
