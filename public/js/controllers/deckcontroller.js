/**
 * Created by Patrick Taylor on 2/17/14.
 */

var deckControllers = angular.module('deckControllers', []);

deckControllers.controller('DeckController', ['$scope', '$routeParams', function ($scope, $routeParams)
{
    $scope.deckId = $routeParams.deckId;

    $scope.Deck = {
        name: "Rosheen",
        color: "RG",
        builder: "Chris M"
    };
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