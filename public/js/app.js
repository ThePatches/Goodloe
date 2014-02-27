var goodloeApp = angular.module('goodloeApp', ['ngRoute', 'deckControllers', "defaultController", "ngCookies", "gameControllers", "GameDirectives"]);

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
            .when('/game',
            {
                templateUrl: "views/game.html",
                controller: "GameController"
            })
        .otherwise({
                templateUrl: "views/404View.html",
                controller: defaultController
            });
    }
]);

var defaultController = angular.module('defaultController', []);

defaultController.controller('DefaultController', function($scope)
{
    var aDate = new Date(jQuery.now());
    $scope.Date =  aDate.toUTCString();
});

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
