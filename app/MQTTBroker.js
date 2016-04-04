var mqtt = require('mqtt'), path = require('path'), configuration = require(path.join(BASE_DIR, "config/local.json")),
	_client = null, GameModel = require(path.join(BASE_DIR, "app/GameModel.js"));

/**
 * Initialize
 */
exports.initialize = function () {
	_client  = mqtt.connect(configuration.mqtt.url, {
	    "port": configuration.mqtt.port,
        "username": configuration.mqtt.user,
        "password": configuration.mqtt.password
    });

	_client.on('connect', function() { // When connected
		  // subscribe to a topic
	    _client.subscribe(configuration.mqtt.topic.sensor);
	    _client.subscribe(configuration.mqtt.topic.getConfig);
	 });

	// flushes the topics to avoid unexpected message when a new game starts
	this.flushTopics();
	// On message event
	this._onMessageEvent();
};

/**
 * Publish
 */
exports.publish = function (topic, message, callback) {
    console.log("MQTTBroker", topic, "/", message);
//    console.log(_client);
    ret = _client.publish(topic, message, "{qos:2}", callback);
//    ret = _client.publish(topic, message, "{qos:2}");
//    console.log(ret);
	return ret;
};

/**
 * On message event
 */
exports._onMessageEvent = function () {
	var _playerIndex = null, _defaultPoints = 1;

	// On "message" event
	_client.on('message', function (topic, message) {
		_playerIndex = parseInt(message.toString(), 10);
		console.log("_onMessageEvent", topic, "/", _playerIndex);

		// Update player points
		GameModel.incrementPlayerPoints(_playerIndex, _defaultPoints);
	});
};

/**
 * Flushes all the topics set in the configuration object
 */
exports.flushTopics = function(){
	for(var _topic in configuration.mqtt.topic) {
//		console.log("flush ", configuration.mqtt.topic[_topic]);
		_client.publish(configuration.mqtt.topic[_topic], "", "{qos:2, retain:true}");
	}
}
