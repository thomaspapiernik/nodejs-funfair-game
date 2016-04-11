/**
 * Arena controller
 */
funfairGameApp.controller('ArenaCtrl', ['$scope', '$http', '$interval', '$window', function ($scope, $http, $interval, $window) {

    $scope._refreshPromise = null;

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

        // Players
        for (var idx in response.players) {
            _player = angular.copy(response.players[idx]);

            _player.offset = Math.floor(((_player.points / $scope.configuration.totalPoints)
				* ($window.innerWidth * ($scope.configuration.body.widthPercent / 100)
				- parseInt(window.getComputedStyle(angular.element(".endline")[0]).marginRight, 10))));

            _players.push(_player);

            if ($scope.configuration.totalPoints <= _player.points) {
                _winners.push(_player.name);
            }
        }

        if (0 < _winners.length) {
            $http.post("/games/winners", {'winners': _winners[0]})
                .success(function (response) {
                    console.log(new Date().toISOString(),"- Player(s) '" + _winners.join(", ") + "' won the game");
                 })
                .error(function (response) {
                    console.log("Error while posting game winners");
                });
            _player.points=0;
            // End of game
            $scope.endOfGame = true;
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
