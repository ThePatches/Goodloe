/**
 * Created by Patrick Taylor on 2/17/14.
 */

var deckControllers = angular.module('deckControllers', []);

deckControllers.controller('DeckController', ['$scope', '$routeParams','$http', function ($scope, $routeParams, $http)
{
    $scope.deckId = $routeParams.deckId;
    $scope.doEdit = false;

    $scope.fixName = function (inName)
    {
        return inName.replace(/\+/g, " ");
    };

    $scope.buildParams = function()
    {
        return "?coll=Deck&Name=" + encodeURIComponent($scope.Deck.name) + "&Color=" + encodeURIComponent($scope.Deck.color) + "&Builder=" + encodeURIComponent($scope.Deck.builder);
    };

    $scope.addDeck = function()
    {
        var tUrl = 'http://localhost:1337/';
        tUrl += $scope.deckId != 'new' ? "update" : "add";

        tUrl += $scope.buildParams();

        // http call goes here.
        //alert(tUrl);

        $http.get(tUrl).success(function (data)
        {
            $scope.Deck = data;
        });
    };

   if ($scope.deckId != 'new')
    {
        $http.get('http://localhost:1337/query?coll=deck&id=' + $scope.deckId).success(function (data) {
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

        $http.get('http://localhost:1337/query?coll=deck').success(function (data) // Need to get this to work parameterized
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