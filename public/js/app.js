var goodloeApp = angular.module('goodloeApp', ['ngRoute',
    'deckControllers',
    "defaultController",
    "ngCookies",
    "gameControllers",
    "playerControllers",
    "userControllers",
    "GameDirectives",
    "GlobalDirectives"]);

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
            .when('/user',
                {
                  templateUrl: "views/userprofile.html",
                  controller: "ProfileController"
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

defaultController.controller("LoginRequest", ['$scope', '$http', '$location', function($scope, $http, $location)
{
    $scope.reqUser = {Name: "", uName: ""}; // TODO: Come up with a way to contact the user who wanted a login
    $scope.errMsg = "Confirm your password!";
    $scope.pass1 = "";
    $scope.pass2 = "";
    $scope.showErr = false;
    $scope.canSubmit = true;

    $scope.doSubmit = function() // TODO: Finish validations
    {
        if ($scope.pass2.trim() == "")
        {
            $scope.showErr = true;
            return;
        }

        if ($scope.pass1 != $scope.pass2)
        {
            $scope.errMsg = "Your passwords must match.";
            $scope.showErr = true;
            return;
        }

        var newUser = {};
        newUser.username = $scope.reqUser.uName;
        newUser.person = $scope.reqUser.Name;
        newUser.password = $scope.pass1;

        $http({
            url: CONFIG.server + "requser",
            method: "POST",
            data: newUser,
            headers: {'Content-type': 'application/json; charset=utf-8'}
        }).success(function (data)
            {
                $scope.Messages = "A request to add your user has been sent to the site admin.";
                $scope.canSubmit = false;

            }).error(function (err)
            {
                $scope.Messages = "Error: " + JSON.stringify(err);
                $scope.canSubmit = false;
            });

        $scope.showErr = false;
    };

    $scope.Cancel = function()
    {
        $location.path("/");
    };
}]);

angular.module("GlobalDirectives", [])
    .directive("clearInputs", function()
    {
        return {
            restrict: "A",
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs)
            {
                var clearDivId = $attrs.formDiv;
                $element.click(function()
                {
                    $("#" + clearDivId + "> input").each(function ()
                    {
                       $(this).val("");
                    });
                });
            }]
        }
    });
