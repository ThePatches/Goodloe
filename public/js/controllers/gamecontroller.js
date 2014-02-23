/**
 * Created by Patrick Taylor on 2/23/14.
 */
var gameControllers = angular.module('gameControllers', []);

gameControllers.controller("GameController", ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http)
{
    $scope.Decks = [{name: "Patrick", value: "p"}, {name: "John", value: "j"}, {name: "Chris", value: "c"}];
    $scope.Players = [4, 5, 6, 7];
    $scope.newGame = true;

}]);