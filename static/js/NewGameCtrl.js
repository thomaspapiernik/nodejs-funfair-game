/**
 * New game controller
 */
funfairGameApp.controller('NewGameCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    /**
     * Get array number
     */
    $scope.getArrayNumber = function (number) {
        var _values = [];

        if ("undefined" === typeof(number)) {
            return _values;
        }

        for (var idx = 1; idx <= parseInt(number, 10); idx++) {
            _values.push(idx);
        }

        return _values;
    };

    /**
     * On game validated
     */
    $scope.onGameValidated = function () {
        // Display popin
        angular.element("#new-game-dialog").modal("show");
    };

    /**
     * On game confirmed
     */
    $scope.onGameConfirmed = function () {
        var _players = angular.copy($scope.newPlayers);

        // Hide popin
        angular.element("#new-game-dialog").modal("hide");
        angular.element('body').removeClass('modal-open');
        angular.element('.modal-backdrop').remove();

        $http.post("/games", {'players': _players})
            .success(function (response) {
                $location.url("/arena");
            })
            .error(function (response) {
                console.log("Error while posting game informations");
            });
    };

    /**
     * Initialize
     */
    $scope.init = function () {
        $scope.newPlayers = {};

        $scope.characters = [{
            "name": "perso1",
            "image": "characters/perso-1.png"
        }, {
            "name": "perso2",
            "image": "characters/perso-2.png"
        }];
    };

    $scope.init();
}]);
