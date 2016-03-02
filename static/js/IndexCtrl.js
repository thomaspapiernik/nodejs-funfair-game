/**
 * Index controller
 */
funfairGameApp.controller('IndexCtrl', ['$scope', function ($scope) {

    /**
     * Attributes
     */
    $scope.configuration = {
        "refreshInterval": 1000,
        "totalPoints": 50,
        'body': {
            'widthPercent': 90
        },
        "player": {
            "width": 50
        }
    };

    /**
     * Initialize
     */
    $scope.init = function () {

    };

    $scope.init();
}]);
