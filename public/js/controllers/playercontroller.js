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

            return (theCookie.username && theCookie.username !== "");
        };

        $http.get('/player/get').success(function (data)
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
                url: "/player/add",
                method: "POST",
                data: {name: nName, games: 0, wins: 0, active: true},
                headers: {'Content-type': 'application/json; charset=utf-8'}
            }).success(function (data)
                {
                    $scope.Players.push(data);
                    $scope.doEdit = false;
                });
        };
    }]);

playerControllers.controller('PlayerController', ['$scope', '$routeParams','$http', '$cookies', '$location', function ($scope, $routeParams, $http, $cookies, $location)
{
    $scope.playerId = $routeParams.playerId;
    $scope.isEditing = false;

    $scope.canEdit = function ()
    {
        var myCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : null;

        return myCookie !== null && myCookie.adminRights > 0;
    };

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    if ($scope.playerId != 'new')
    {
        $http.get('/player/get?&id=' + $scope.playerId).success(function (data)
        {
            $scope.Player = data[0];
        });
    }

    $scope.updatePlayer = function ()
    {
        var thePlayer = $scope.Player;
        $http.post('/player/update', {thePlayer: thePlayer})
            .success(function (data)
            {
                $scope.Player = data;
                $scope.isEditing = false;
            }).error(function (err)
                {
                    if (err == "Unauthorized")
                    {
                        //alert("You are not logged in. You must be logged in to continue!");
                        $location.path('/login').search({reason: "auth"});
                }
            });
    };
}]);