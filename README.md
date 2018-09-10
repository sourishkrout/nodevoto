# Node.js' Emoji.voto

A microservice application that allows users to vote for their favorite emoji,
and tracks votes received on a leaderboard. May the best emoji win.

The application is composed of the following 3 services:

* [nodevoto-web](services/nodevoto-web/): Web frontend and REST API
* [nodevoto-emoji](services/nodevoto-emoji/): gRPC API for finding and listing emoji
* [nodevoto-voting](services/nodevoto-voting/): gRPC API for voting and leaderboard

![Nodevoto Topology](assets/emojivoto-topology.png "Emojivoto Topology")

## Local Development

### Nodevoto webapp

This app is written with React and bundled with webpack.
Use the following to run the nodevoto go services and develop on the frontend.

Start the voting service
```
GRPC_PORT=8081 npm run voting
```

[In a separate teminal window] Start the emoji service
```
GRPC_PORT=8082 npm run emoji
```

[In a separate teminal window] Bundle the frontend assets
```
cd nodevoto-web/webapp
yarn install
yarn webpack # one time asset-bundling OR
yarn webpack-dev-server --port 8083 # bundle/serve reloading assets
```

[In a separate teminal window] Start the web service
```
export WEB_PORT=8080
export VOTINGSVC_HOST=localhost:8081
export EMOJISVC_HOST=localhost:8082

# if you ran yarn webpack
export INDEX_BUNDLE=nodevoto-web/webapp/dist/index_bundle.js

# if you ran yarn webpack-dev-server
export WEBPACK_DEV_SERVER=http://localhost:8083

# start the webserver
npm run web
```

[Optional] Start the vote bot for automatic traffic generation.
```
export WEB_HOST=localhost:8080
npm run voteBot
```
