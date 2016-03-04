var _currentGame = null;

/**
 * Create game
 */
exports.createGame = function (players, callback) {
	var _game = {
		"players": {}
	};
	
	for (var idx in players) {
		_game.players[idx] = {
			"name": players[idx].name,
			"image": players[idx].image,
			"points": 0
		};
	}

	_currentGame = _game;

	return callback();
};

/**
 * Get current game
 */
exports.getCurrentGame = function (options) {
	return _currentGame;
};

/**
 * Increment player points
 */
exports.incrementPlayerPoints = function (playerIndex, points) {
	if (_currentGame) {
		if (("undefined" !== typeof(_currentGame.players)) && ("undefined" !== typeof(_currentGame.players[playerIndex]))) {
			_currentGame.players[playerIndex].points += points;
		} else {
			console.log("Player " + playerIndex + " not found");
		}
	} else {
		console.log("There is no game in progress");
	}
};