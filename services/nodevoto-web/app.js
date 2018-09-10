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

  async handleLeaderboard(req, res) {
    const findByShortcode = wrapOp(this.emojiClient.FindByShortcode.bind(this.emojiClient));
    const getResults = wrapOp(this.votingClient.Results.bind(this.votingClient));
    let response = await getResults();

    let list = response.results.map(async (item) => {
      return findByShortcode({ Shortcode: item.Shortcode }).then(r => {
        return { 'shortcode': r.Emoji.shortcode,
          'unicode': r.Emoji.unicode,
          'votes': item.Votes };
      });
    });

    return res.json(await Promise.all(list));
  }

  async handleVoteEmoji(req, res) {
    let emojiShortcode = req.query['choice'], vote;
    const findByShortcode = wrapOp(this.emojiClient.FindByShortcode.bind(this.emojiClient));

    let response = await findByShortcode({ Shortcode: emojiShortcode });

    let operation = Object.entries(shortcode).filter(sc => {
      return sc[1] === emojiShortcode;
    });

    let op = operation.length > 0 ? operation[0][0] : null;

    if (op !== null && this.votingClient[op] !== undefined) {
      vote = wrapOp(this.votingClient[op].bind(this.votingClient));
    } else if (emojiShortcode === ':poop:') {
      vote = wrapOp(this.votingClient.VotePoop.bind(this.votingClient));
    } 

    try {
      await vote();
      return res.end();
    } catch (err) {
      return res.status(500).end(err.details);
    }
  }

  async handleListEmoji(req, res) {
    const listAll = wrapOp(this.emojiClient.ListAll.bind(this.emojiClient));
    let emoji = await listAll();

    return res.json(emoji.list);
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
