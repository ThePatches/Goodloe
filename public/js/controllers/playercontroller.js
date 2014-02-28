/**
 * Created by Patrick Taylor on 2/28/14.
 */

var playerControllers = angular.module('playerControllers', []);

playerControllers.controller('PlayerListController', ['$scope', '$http', '$location',
    function($scope, $http, $location){
        $http.get(CONFIG.server + ":" + CONFIG.port + '/query?coll=player').success(function (data) // Need to get this to work parameterized
        {
            $scope.Players = data;
        });

        $scope.fixName = function (inName)
        {
            return inName.replace(/\+/g, " ");
        };

        $scope.loadPlayer = function(inID)
        {
            $location.path("/player/" + inID);
        };
    }]);

playerControllers.controller('PlayerController', ['$scope', '$routeParams','$http', '$cookies', function ($scope, $routeParams, $http, $cookies)
{
    $scope.playerId = $routeParams.playerId;
    $scope.doEdit = false;

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    if ($scope.playerId != 'new')
    {
        $http.get(CONFIG.server + ":" + CONFIG.port + '/query?coll=player&id=' + $scope.playerId).success(function (data)
        {
            $scope.Player = data[0];
        });
    }
}]);