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

    $scope.buildParams = function()
    {
        var theJSON = {name: encodeURIComponent($scope.Deck.name), color: encodeURIComponent($scope.Deck.color), builder: encodeURIComponent($scope.Deck.builder)};
        if ($scope.deckId != 'new')
        {
            theJSON._id = $scope.deckId;
        }

        return "?coll=Deck&item=" + JSON.stringify(theJSON);
    };

    $scope.CheckCookie = function()
    {
        var theCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : "None";

        if (theCookie == "None")
            return false;

        return (theCookie.username && theCookie.username != "");
    };

    $scope.addDeck = function()
    {
        var tUrl = CONFIG.server;
        tUrl += $scope.deckId != 'new' ? "update" : "add";

        tUrl += $scope.buildParams();

        $http.get(tUrl).success(function (data)
        {
            $scope.Deck = data;
            if ($scope.deckId == "new")
            {
                $location.path("/decks");
            }
        });
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
}]);