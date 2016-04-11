/**
 * Arena controller
 */
funfairGameApp.controller('ArenaCtrl', ['$scope', '$http', '$interval', '$window', '$timeout', function ($scope, $http, $interval, $window, $timeout) {

    $scope._refreshPromise = null;
    $scope._imagesAlreadyLoaded = false;
    $scope._gamePlayers = null;

    /**
     * Refresh informations
     */
    $scope._refreshInformations = function () {
        //console.log("Loading informations");

        $http.get('/games/latest')
            .success(function (response) {
                //console.log("Informations loaded");

                if (response) {
                    $scope._refreshGame(response);
                }
            })
            .error(function (response) {
                console.log("Error while loading game information");
            });
    };

    /*
     * Refresh game
     */
    $scope._refreshGame = function (response) {
        if ($scope.endOfGame) {
            return;
        }
        var _player = null, _players = [], _winners = [];

        // Preload images
        $scope._preloadImages(response.players);

        // Players
        for (var idx in response.players) {
            _player = angular.copy(response.players[idx]);

            _player.ratio = _player.points / $scope.configuration.totalPoints;

            _players.push(_player);

            if ($scope.configuration.totalPoints <= _player.points) {
                _winners.push(_player.name);
            }
        }

        if (0 < _winners.length) {
            $http.post("/games/winners", {'winners': _winners[0]})
                .success(function (response) {
                    console.log(new Date().toISOString(), "- Player(s) '" + _winners.join(", ") + "' won the game");
                 })
                .error(function (response) {
                    console.log("Error while posting game winners");
                });
            _player.points=0;
            // End of game
            $scope.endOfGame = true;
        }

        // Update game
        $scope._updateGame(_players);
    };

    /**
     * Preload images
     */
    $scope._preloadImages = function (players) {
        var _imageName = null, _numbers = {};

        if (!$scope._imagesAlreadyLoaded) {
            $scope._imagesAlreadyLoaded = true;

            // Background
            $scope._game.add.sprite(0, 0, 'back', 'background');

            // Players
            for (var idx in players) {
                _imageName = players[idx].image.substring(players[idx].image.lastIndexOf("/") + 1, players[idx].image.lastIndexOf("."));
            console.log("ADD", _imageName, players[idx].image, players[idx].image.replace('png', 'json'));
                $scope._game.load.atlasJSONHash(_imageName, players[idx].image, players[idx].image.replace('png', 'json'));
                $scope._game.load.image('b' + idx, 'images/numbers/' + idx + '.png');

                _numbers["b" + idx] = $scope._game.add.image(0, 0, 'b' + idx);
                _numbers["b" + idx].anchor.set(0.1);
            }
        }
    }

    /**
     * Preload game
     */
    $scope._preloadGame = function () {
        var _imgIndex = Math.floor(Math.random() * 2) + 1;

        $scope._game.load.atlasJSONHash('back', 'images/arena/back' + _imgIndex + '.png', 'images/arena/back' + _imgIndex + '.json');

        $scope._game.load.atlasJSONHash("adventuregirl", "images/characters/sprites/adventuregirl.png", "images/characters/sprites/adventuregirl.json");
        $scope._game.load.atlasJSONHash("adventuregirl_idle", "images/characters/sprites/adventuregirl_idle.png", "images/characters/sprites/adventuregirl_idle.json");
        $scope._game.load.atlasJSONHash("dragon", "images/characters/sprites/dragon.png", "images/characters/sprites/dragon.json");

        $scope._game.load.image('b1', 'images/numbers/1.png');
        $scope._game.load.image('b2', 'images/numbers/2.png');
        $scope._game.load.image('b3', 'images/numbers/3.png');
        $scope._game.load.image('b4', 'images/numbers/4.png');
        $scope._game.load.image('b5', 'images/numbers/5.png');
    };

    /**
     * Update game
     */
    $scope._updateGame = function (players) {
        var _imageName = null;

        if (!$scope._gamePlayers) {
            $scope._gamePlayers = {};

            for (var idx in players) {
                _imageName = players[idx].image.substring(players[idx].image.lastIndexOf("/") + 1, players[idx].image.lastIndexOf("."));

                $scope._gamePlayers[idx] = $scope._game.add.sprite(0, idx * 100, _imageName, 'Run (1).png');
                $scope._gamePlayers[idx].animations.add('walk', Phaser.Animation.generateFrameNames('Run (', 1, 8, ').png', 1), 10, true, false);
                $scope._gamePlayers[idx].animations.play('walk');
            }
        }

        // Move
        for (var idx in players) {
            _imageName = players[idx].image.substring(players[idx].image.lastIndexOf("/") + 1, players[idx].image.lastIndexOf("."));
            $scope._gamePlayers[idx].x = players[idx].ratio * $scope.configuration.arena.width;
        }
    };

    /**
     * On destroy view
     */
    $scope.$on('$destroy', function () {
        if ($scope._refreshPromise) {
            $interval.cancel($scope._refreshPromise);
        }
    });

    /**
     * Initialize
     */
    $scope.init = function () {
        // Create game
        $scope._game = new Phaser.Game($scope.configuration.arena.width, $scope.configuration.arena.height, Phaser.AUTO, '', {
            "preload": $scope._preloadGame,
            "create": function () {},
            "update": $scope._refreshInformations
        });

        //$scope._refreshInformations();

        // Set interval
        //$scope._refreshPromise = $timeout($scope._refreshInformations, $scope.configuration.refreshInterval);
    };

    $scope.init();
}]);
