var goodloeApp = angular.module('goodloeApp', ['ngRoute', 'deckControllers', "defaultController", "ngCookies", "gameControllers", "userControllers", "playerControllers", "GameDirectives", "GlobalDirectives"]);

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
            .when('/user/me',
                {
                  templateUrl: "views/userprofile.html",
                  controller: "ProfileController"
                })
            .when('/changelog',
            {
                templateUrl: "views/patchlist.html",
                controller: "PatchListController"
            })
            .when('/suggest',
            {
                templateUrl: "views/suggest.html",
                controller: "SuggestController"
            })
            .when('/rules',
            {
                templateUrl: "views/rules.html",
                controller: "RulesController"
            })
            .when('/userlist',
            {
                templateUrl: "views/userlist.html",
                controller: "UserListController"
            })
        .otherwise({
                templateUrl: "views/404View.html",
                controller: defaultController
            });
    }
]);

var defaultController = angular.module('defaultController', []);

defaultController.controller('DefaultController', ['$scope', '$cookies', function($scope, $cookies)
{
    var aDate = new Date(jQuery.now());
    $scope.Date =  aDate.toUTCString();
    $scope.userName = null;

    $scope.isLoggedIn = function()
    {
        //$scope.SomeStuff = $cookies.gookie ? JSON.parse($cookies.gookie).username : "None";
        if ($cookies.gookie)
        {
            $scope.userName = JSON.parse($cookies.gookie).username;
            return true;
        }
        else
            return false;
    };
}]);

defaultController.controller("RulesController",['$scope', function($scope){
    $scope.Title = "Rules";
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
            url: "/requser",
            method: "POST",
            data: newUser,
            headers: {'Content-type': 'application/json; charset=utf-8'}
        }).success(function ()
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

defaultController.controller("SuggestController", ['$scope', '$http', '$location', function($scope, $http, $location)
{
    $scope.email = "";
    $scope.title = "";
    $scope.suggestion = "";
    $scope.Messages = "";
    $scope.canSubmit = true;
    $scope.hasSubmitted = false;

    $scope.doSubmit = function ()
    {
        var subObject = {email: $scope.email, title: $scope.title, suggestion: $scope.suggestion};

        $http({
            url: "/suggest",
            method: "POST",
            data: subObject,
            headers: {'Content-type': 'application/json; charset=utf-8'}
        }).success(function ()
            {
                $scope.Messages = "You suggestion has been sent to the site admin.";
                $scope.canSubmit = false;
                $scope.hasSubmitted = true;

            }).error(function (err)
            {
                $scope.Messages = "Error: " + JSON.stringify(err);
                $scope.canSubmit = false;
            });
    };

    $scope.Cancel = function()
    {
        $location.path("/");
    };
}]);

defaultController.controller("PatchListController", ['$scope', '$http', function($scope, $http)
{
    $scope.PatchList = null;

    $http.get('/patches')
        .success(function(data)
        {
            $scope.PatchList = data;
        })
        .error(function(err)
        {
           $scope.PatchList = [{version: "Failed to get version!", patches: [err]}]
        });
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

                    $("#" + clearDivId + ">textarea").each(function ()
                    {
                        $(this).val("");
                    })
                });
            }]
        }
    })

    .directive("patchExpander", function()
    {
        return {
            restrict: "A",
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs)
            {
                var parentElement = $element.parent();
                var list = parentElement.find("ul");

                $element.click(function ()
                {
                   if (list.is(":visible"))
                       list.css("display", "none");
                   else
                       list.css("display", "block");
                });

                $element.ready(function ()
                {
                    if ($attrs.patchIndex > 0)
                        list.css("display", "none");
                });
            }]
        }
    })

;
