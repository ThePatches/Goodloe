/**
 * Created by Patrick Taylor on 2/23/14.
 */
var gameControllers = angular.module('gameControllers', []);

gameControllers.controller("GameController", ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http)
{
    $scope.Decks = null; //[{name: "Patrick", value: "p"}, {name: "John", value: "j"}, {name: "Chris", value: "c"}];
    $scope.Players = [4, 5, 6, 7];
    $scope.newGame = true;
    $scope.selDeck = null;
    $scope.inDecks = [];

    $http.get(CONFIG.server + ":" + CONFIG.port + '/query?coll=deck').success(function (data) // Need to get this to work parameterized
    {
        $scope.Decks = data;
    });

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    $scope.getDeckName = function(inDeck)
    {
        return $scope.fixName(inDeck.name) + " by " + $scope.fixName(inDeck.builder);
    };

}]);