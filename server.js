var express = require('express'), server = express(), path = require('path'), http = require('http'), dust = require('dustjs-linkedin'),
    consolidate = require('consolidate'), bodyParser = require('body-parser');

var _port = 8003,
    _currentGame = null;

/**
 * Configuration
 */
server.use(bodyParser.json()); // For parsing application/json
server.use(bodyParser.urlencoded({"extended": true})); // For parsing application/x-www-form-urlencoded
server.use(express.static(path.join(__dirname, 'static')));

server.engine('dust', consolidate.dust);
server.set('template_engine', "dust");
server.set('view engine', "dust");
server.set('views', __dirname + '/views');

/**
 * Routes
 */
server.get('/', function (req, res, next) {
    return res.render("index");
});

server.get('/views/arena', function (req, res, next) {
    return res.render("arena");
});

server.get('/views/new-game', function (req, res, next) {
    return res.render("new-game");
});

server.post('/games', function (req, res, next) {
    var _game = req.body;

    for (var idx in _game.players) {
        _game.players[idx].sensors = {'1': [5]};
    }

    _currentGame = _game;

    return res.json(_currentGame);
});

server.get('/games/latest', function (req, res, next) {
    return res.json(_currentGame);
});

http.createServer(server).listen(_port, function () {
    console.log("HTTP server listening on port " + _port);
});
