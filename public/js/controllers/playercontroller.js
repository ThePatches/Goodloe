/**
 * Created by Patrick Taylor on 2/28/14.
 */

var playerControllers = angular.module('playerControllers', []);

playerControllers.controller('PlayerListController', ['$scope', '$http', '$location', '$cookies',
    function($scope, $http, $location, $cookies) {

        $scope.canEdit = false;
        $scope.doEdit = false;
        $scope.newPlayer = null;

        /** @return boolean */
        $scope.CheckCookie = function()
        {
            var theCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : "None";

            if (theCookie == "None")
                return false;

            return (theCookie.username && theCookie.username != "");
        };

        $http.get('/query?coll=player').success(function (data)
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

        $scope.addPlayer = function ()
        {
            var nName = $scope.newPlayer;
            $http({
                url: "/add?coll=player",
                method: "POST",
                data: {name: nName, games: 0, wins: 0, active: true},
                headers: {'Content-type': 'application/json; charset=utf-8'}
            }).success(function (data)
                {
                    $scope.Players.push(data);
                    $scope.doEdit = false;


                });
        }
    }]);

playerControllers.controller('PlayerController', ['$scope', '$routeParams','$http', function ($scope, $routeParams, $http)
{
    $scope.playerId = $routeParams.playerId;

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    if ($scope.playerId != 'new')
    {
        $http.get('/query?coll=player&id=' + $scope.playerId).success(function (data)
        {
            $scope.Player = data[0];
        });
    }
}]);