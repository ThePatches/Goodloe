var goodloeApp = angular.module('goodloeApp', ['ngRoute', 'deckControllers', "defaultController", "ngCookies", "gameControllers", "playerControllers", "GameDirectives"]);

goodloeApp.config(['$routeProvider',
    function($routeProvider)
    {
        $routeProvider.when('/deck/:deckId', {
           templateUrl: "views/deck.html",
           controller: "DeckController"
        })
            .when('/', {
                templateUrl: "views/default.html",
                controller: "DefaultController"
            })
            .when('/decks', {
                templateUrl: "views/decklist.html",
                controller: "DeckListController"
            })
            .when('/login',
            {
                templateUrl: "views/login.html",
                controller: "LoginController"
            })
            .when('/game/:gameId',
            {
                templateUrl: "views/game.html",
                controller: "GameController"
            })
            .when('/games',
            {
                templateUrl: "views/gameslist.html",
                controller: "GameListController"
            })
            .when('/players',
            {
                templateUrl: "views/playerlist.html",
                controller: "PlayerListController"
            })
            .when('/player/:playerId',
                {
                    templateUrl: "views/player.html",
                    controller: "PlayerController"
                })
            .when('/adduser',
            {
                templateUrl: "views/adduser.html",
                controller: "AddUserController"
            })
            .when('/loginrequest',
            {
                templateUrl: "views/loginrequest.html",
                controller: "LoginRequest"
            })
        .otherwise({
                templateUrl: "views/404View.html",
                controller: defaultController
            });
    }
]);

var defaultController = angular.module('defaultController', []);

defaultController.controller('DefaultController', ['$scope', '$http', function($scope, $http)
{
    var aDate = new Date(jQuery.now());
    $scope.Date =  aDate.toUTCString();
}]);

defaultController.controller("LoginController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location)
{
    $scope.userName = null;
    $scope.password = null;
    $scope.SomeStuff = $cookies.gookie ? JSON.parse($cookies.gookie).username : "None";
   // $scope.Other = $cookieStore.get('gookie');

    $scope.DoLogin = function()
    {
        $http.post("/login", {username: $scope.userName, password: $scope.password})
            .success(function(user)
            {
                if (user)
                {
                    $scope.SomeStuff = user.username;

                    $scope.userName = "";
                    $scope.password = "";
                    $location.path('/');
                }
                else
                {
                    $scope.SomeStuff = "failed login!";
                }
            }).error(function ()
            {
                $scope.SomeStuff = "failed login!";
            });
    };

    $scope.DoLogOut = function ()
    {
        $http.post("/logout");
        $scope.SomeStuff = "None";
    };
}]);

defaultController.controller("AddUserController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    $scope.username = null;
    $scope.password = null;
    $scope.adminRights = 1;

    $scope.addUser = function()
    {
        var addUser = {username: $scope.username, pass: $scope.password, adminRights: $scope.adminRights};

        $http.post(CONFIG.server + "adduser", {addUser: addUser})
            .success(function (response)
            {
                $scope.OutMessage = response;
            })
            .error(function(response)
            {
                $scope.OutMessage = response;
            });
    };

}]);

defaultController.controller("LoginRequest", ['$scope', '$http', '$location', function($scope, $http, $location)
{
    $scope.reqUser = {};
}]);
