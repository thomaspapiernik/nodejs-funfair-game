var mqtt = require('mqtt'), path = require('path'), configuration = require(path.join(BASE_DIR, "config/local.json")),
	_client = null, GameModel = require(path.join(BASE_DIR, "app/GameModel.js"));

/**
 * Initialize
 */
exports.initialize = function () {
	_client  = mqtt.connect(configuration.mqtt.url, { port : 1883,
				  username: configuration.mqtt.user,
				  password: configuration.mqtt.password });

	_client.on('connect', function() { // When connected
		  // subscribe to a topic
	    _client.subscribe(configuration.mqtt.topic);
	 });

	// On message event
	this._onMessageEvent();
};

/**
 * Publish
 */
exports.publish = function (message, callback) {
	return _client.publish(configuration.mqtt.topic, message, callback);
};

/**
 * On message event
 */
exports._onMessageEvent = function () {
	var _playerIndex = null, _defaultPoints = 1;

	// On "message" event
	_client.on('message', function (topic, message) {
		_playerIndex = parseInt(message.toString(), 10);

		// Update player points
		GameModel.incrementPlayerPoints(_playerIndex, _defaultPoints);
	});
};
