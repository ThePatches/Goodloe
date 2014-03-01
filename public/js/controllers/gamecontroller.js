/**
 * Created by Patrick Taylor on 2/23/14.
 */
var gameControllers = angular.module('gameControllers', []);

gameControllers.controller("GameController", ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http)
{
    $scope.Decks = null; //[{name: "Patrick", value: "p"}, {name: "John", value: "j"}, {name: "Chris", value: "c"}];
    $scope.Players = null;
    $scope.newGame = true;
    $scope.selDeck = null;
    $scope.inDecks = [{player: "none", deck: "none", winner: false}];
    $scope.OutGame = null;

    $http.get(CONFIG.server + ":" + CONFIG.port + '/query?coll=deck').success(function (data) // Need to get this to work parameterized
    {
        $scope.Decks = data;
    });

    $http.get(CONFIG.server + ":" + CONFIG.port + '/query?coll=player').success(function (data) // Need to get this to work parameterized
    {
        $scope.Players = data;
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

    $scope.getDescription = function(inObject)
    {
        // We can do this better if we're better with our objects...

        //return inObject.player + " playing" + inObject.deck
        var theDeck = null, thePlayer = null, i = 0;

        if (inObject.player != "none")
        {
            for (i = 0; i < $scope.Players.length; i++)
                if (inObject.player == $scope.Players[i]._id)
                    thePlayer = $scope.Players[i].name;

            for (i = 0; i < $scope.Decks.length; i++)
                if (inObject.deck == $scope.Decks[i]._id)
                    theDeck = $scope.fixName($scope.Decks[i].name);

            return thePlayer + " playing " + theDeck;
        }
        else
        {
            return "No Decks Selected"
        }

    };

    $scope.setWinner = function(index)
    {
        for (var i = 0; i < $scope.inDecks.length; i++)
        {
            $scope.inDecks[i].winner = i == index;
        }
    };

}]);