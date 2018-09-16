'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('../../lib/logger');
const shortcode = require('../../lib/shortcode.json');

const wrapOp = (op) => {
  return (arg) => {
    let p = new Promise((res, rej) => {
      op(arg, (err, payload) => {
        if (err) { return rej(err); }
        return res(payload);
      });
    });

    return p;
  };
};

class App {
  constructor(routes, webPort, webpackDevServerHost, indexBundle, emojiClient, votingClient) {
    this.webPort = webPort;
    this.webpackDevServerHost = webpackDevServerHost;
    this.indexBundle = indexBundle;
    this.emojiClient = emojiClient;
    this.votingClient = votingClient;

    routes.get('/', this.handleIndex.bind(this));
    routes.get('/leaderboard', this.handleIndex.bind(this));
    routes.get('/js', this.handleJs.bind(this));
    routes.get('/img/favicon.ico', this.handleFavicon.bind(this));
    routes.get('/api/list', this.handleListEmoji.bind(this));
    routes.get('/api/vote', this.handleVoteEmoji.bind(this));
    routes.get('/api/leaderboard', this.handleLeaderboard.bind(this));
  }

  async _Results() {
    let response = await wrapOp(this.votingClient.Results.bind(this.votingClient))();
    return response.results;
  }

  async _FindByShortcode(arg) {
    let response = await wrapOp(this.emojiClient.FindByShortcode.bind(this.emojiClient))(arg);
    return response.Emoji;
  }

  async _ListAll() {
    let response = await wrapOp(this.emojiClient.ListAll.bind(this.emojiClient))();
    return response.list;
  }

  async handleError(err, res) {
    logger.error(err);
    return res.status(500).json(err.message);
  }

  async handleLeaderboard(req, res) {
    try {
      let results = await this._Results();

      let list = results.map(async (item) => {
        return this._FindByShortcode({ Shortcode: item.Shortcode }).then(emoji => {
          return { 'shortcode': emoji.shortcode,
            'unicode': emoji.unicode,
            'votes': item.Votes };
        });
      });

      return res.json(await Promise.all(list));
    } catch (err) {
      this.handleError(err);
    }
  }

  async handleVoteEmoji(req, res) {
    let emojiShortcode = req.query['choice'];
    if (emojiShortcode === undefined || emojiShortcode === '') {
      logger.error(`Emoji choice [${emojiShortcode}] is mandatory`);
      return res.status(400).end();
    }

    try {
      let match = await this._FindByShortcode({ Shortcode: emojiShortcode });

      if (match === null) {
        logger.error(`Choosen emoji shortcode [${emojiShortcode}] doesnt exist`);
        return res.status(400).end();
      }

      let operation = Object.entries(shortcode).filter(sc => {
        return sc[1] === emojiShortcode;
      });

      let op = operation.length > 0 ? operation[0][0] : null;

      if (op !== null && this.votingClient[op] !== undefined) {
        const vote = wrapOp(this.votingClient[op].bind(this.votingClient));
        let voted = await vote();
        return res.json(voted);
      } else {
        logger.error(`Emoji lacks implementation of rpc operation [${op}]`);
        throw new Error('Emoji lacks implementation');
      }
    } catch (err) {
      return this.handleError(err, res);
    }
  }

  async handleListEmoji(req, res) {
    try {
      let list = await this._ListAll();

      return res.json(list);
    } catch(err) {
      return this.handleError(err, res);
    }
  }

  async handleFavicon(req, res) {
    const favicon = path.join(__dirname, '/favicon.ico');
    return res.sendFile(favicon);
  }

  async handleJs(req, res) {
    const indexBundle = path.join(__dirname, '../../', this.indexBundle);
    return res.sendFile(indexBundle);
  }

  async handleIndex (req, res) {
    let js;

    if (this.webpackDevServerHost !== null && this.webpackDevServerHost.length > 0) {
      js = `${this.webpackDevServerHost}/dist/index_bundle.js`;
    } else {
      js = '/js';
    }

    let response = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Emoji Vote</title>
          <link rel="icon" href="/img/favicon.ico">
          <!-- Global site tag (gtag.js) - Google Analytics -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-60040560-4"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-60040560-4');
          </script>
        </head>
        <body>
          <div id="main" class="main"></div>
        </body>
          <script type="text/javascript" src="${js}" async></script>
      </html>`;

    return res.end(response);
  }
}

module.exports.create = async(webPort, webpackDevServerHost, indexBundle, emojiClient, votingClient) => {
  let app = express();
  let routes = express.Router();

  app.set('port', webPort);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/', routes);

  new App(routes, webPort, webpackDevServerHost, indexBundle, emojiClient, votingClient);

  return app;
};
