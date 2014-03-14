/**
 * Created by Patrick Taylor on 2/17/14.
 */

var deckControllers = angular.module('deckControllers', []);

deckControllers.controller('DeckController', ['$scope', '$routeParams','$http', '$cookies', '$location', function ($scope, $routeParams, $http, $cookies, $location)
{
    $scope.deckId = $routeParams.deckId;
    $scope.doEdit = false;

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    $scope.buildObject = function()
    {
        return {name: $scope.Deck.name.replace(/\s/g, "+"), color: encodeURIComponent($scope.Deck.color), builder: $scope.Deck.builder.replace(/\s/g, "+")};
    }

    $scope.CheckCookie = function()
    {
        var theCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : "None";

        if (theCookie == "None")
            return false;

        return (theCookie.username && theCookie.username != "");
    };

    $scope.addDeck = function()
    {
        /*var tUrl = CONFIG.server;
        tUrl += $scope.deckId != 'new' ? "update" : "add";

        tUrl += $scope.buildParams();*/
        var addedDeck = $scope.buildObject();

        $http({
            url: CONFIG.server + "add?coll=deck",
            method: "POST",
            data: {addedDeck: addedDeck},
            headers: {'Content-type': 'application/json; charset=utf-8'}
        }).success(function (data)
            {
                //$scope.OutGame = data;
                $location.path('/deck/' + data._id);
            }).error(function (err)
            {
                $scope.OutGame = "Something went wrong! " + err;
            });

        /*$http.get(tUrl).success(function (data)
        {
            $scope.Deck = data;
            if ($scope.deckId == "new")
            {
                $location.path("/decks");
            }
        });*/
    };

    $scope.parseList = function(inText)
    {
        var masterList = [];
        var i;
        var tempList = inText.split("\n");
        var itemArray = null;

        for (i = 0; i < inText.length; i++)
        {
            itemArray = tempList[i].split("x").trim();
            masterList.append({card: itemArray[0], count: parseInt(itemArray[1])});
        }
    };

    if ($scope.deckId != 'new')
    {
        $http.get(CONFIG.server + 'query?coll=deck&id=' + $scope.deckId).success(function (data) {
            if (data != "no deck returned")
            {
                $scope.Deck = data[0];
            }
        });

    }
    else
    {
        $scope.Deck = {name : "", builder: "", color: ""};
    }
}]);

deckControllers.controller('DeckListController', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.groupField = null;

        $http.get(CONFIG.server + 'query?coll=deck').success(function (data) // Need to get this to work parameterized
        {
            $scope.Decks = data;
        });

        $scope.fixName = function (inName)
        {
            return inName.replace(/\+/g, " ");
        };

        $scope.loadDeck = function(inID)
        {
            $location.path("/deck/" + inID);
        };

        // TODO: Add $scope.$watch(groupField) that organizes the deck list into groups
}]);