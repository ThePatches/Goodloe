/**
 * Created by Patrick Taylor on 2/17/14.
 */

var deckControllers = angular.module('deckControllers', []);

deckControllers.controller('DeckController', function ($scope)
{
    $scope.Deck = {
        name: "Rosheen",
        color: "RG",
        builder: "Chris M"
    };
});