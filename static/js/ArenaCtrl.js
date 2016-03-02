/**
 * Arena controller
 */
funfairGameApp.controller('ArenaCtrl', ['$scope', '$http', '$interval', '$window', function ($scope, $http, $interval, $window) {

    $scope._refreshPromise = null;

    /*$scope._response = {
        "players": {
            "1": {
                "sensors": {
                    "1.1": [23, 3, 4],
                    "1.2": [2, 1, 3]
                },
                "name": "player1",
                "image": "perso-1.png"
            },
            "2": {
                "sensors": {
                    "2.1": [21, 3, 6],
                    "2.2": [1, 1, 5]
                },
                "name": "player2",
                "image": "perso-2.png"
            }
        }
    };*/

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
                console.log("Error while loading game informations");
            });
    };

    /*
     * Refresh game
     */
    $scope._refreshGame = function (response) {
        var _player = null, _players = [], _winners = [];

        // Players
        for (var idx in response.players) {
            _player = angular.copy(response.players[idx]);
            _player.points = 0;

            for (var key in _player.sensors) {
                _player.points += _player.sensors[key].reduce(function (previous, current) {
                    return previous + current;
                });
            }

            _player.offset = Math.floor(((_player.points * $window.innerWidth / $scope.configuration.totalPoints) * ($scope.configuration.body.widthPercent / 100)) - $scope.configuration.player.width);

            _players.push(_player);

            if ($scope.configuration.totalPoints <= _player.points) {
                _winners.push(_player.name);
            }
        }

        if (0 < _winners.length) {
            console.log("Players '" + _winners.join(", ") + "' won the game");
        }

        $scope.players = _players;
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
        $scope._refreshInformations();

        // Set interval
        $scope._refreshPromise = $interval($scope._refreshInformations, $scope.configuration.refreshInterval);
    };

    $scope.init();
}]);
