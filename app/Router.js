var glob = require('glob'), path = require('path'), MQTTBroker = require(path.join(BASE_DIR, "app/MQTTBroker.js")),
	GameModel = require(path.join(BASE_DIR, "app/GameModel.js"));

/**
 * Initialize
 */
exports.initialize = function (server) {
	// Base
	server.get('/', function (req, res, next) {
		return res.render("index");
	});

	// Views
	server.get('/views/arena', function (req, res, next) {
		return res.render("arena");
	});

	server.get('/views/new-game', function (req, res, next) {
		return res.render("new-game");
	});

	// Create game
	server.post('/games', function (req, res, next) {
		GameModel.createGame(req.body.players, function () {
			return res.json(GameModel.getCurrentGame());
		});
	});

	// Get current game
	server.get('/games/latest', function (req, res, next) {
		return res.json(GameModel.getCurrentGame());
	});

	// Characters
	server.get('/characters', function (req, res, next) {
		glob(path.join(BASE_DIR, 'static/images/characters/*'), function (err, files) {
			return res.json(files.map(function (file) {
				return {
					"name": path.basename(file),
					"image": path.join("images/characters", path.basename(file))
				}
			}));
		});
	});
	
	// MQTT
	server.post('/message', function (req, res, next) {
		if ("undefined" !== typeof(req.body.message)) {
			return MQTTBroker.publish(req.body.message, function () {
				return res.json({"success": true});
			});
		}
		
		return res.status(400).json({"error": "Missing 'message' parameter"})
	});
};
