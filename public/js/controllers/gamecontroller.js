/**
 * Created by Patrick Taylor on 2/23/14.
 */
var gameControllers = angular.module('gameControllers', []);

gameControllers.controller("GameController", ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http)
{
    $scope.Decks = null;
    $scope.Players = null;
    $scope.newGame = true;
    $scope.selDeck = null;
    $scope.inDecks = [{player: "none", deck: "none", winner: false}];
    $scope.Description = null;
    $scope.Story = null;
    $scope.OutGame = null;
    $scope.OldGame = {};
    $scope.editGame = false;

    $http.get(CONFIG.server + 'query?coll=deck').success(function (data) // Need to get this to work parameterized
    {
        $scope.Decks = data;
    });

    $http.get(CONFIG.server + 'query?coll=player').success(function (data) // Need to get this to work parameterized
    {
        $scope.Players = data;
    });

    $scope.newGame = $routeParams.gameId == "new";

    if (!$scope.newGame)
    {
        $http.get(CONFIG.server + "query?coll=game&id=" + $routeParams.gameId)
            .success(function (data) {
                $scope.inGame = data[0];
            });
    }

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    $scope.toggleEdit = function ()
    {
        $scope.editGame = !$scope.editGame;
    };

    $scope.getDeckName = function(inDeck)
    {
        return $scope.fixName(inDeck.name) + " by " + $scope.fixName(inDeck.builder);
    };

    $scope.getDescription = function(inObject)
    {
        // We can do this better if we're better with our objects...

        var theDeck = null, thePlayer = null, i = 0;

        if (inObject.player != "none")
        {
            for (i = 0; i < $scope.Players.length; i++)
                if (inObject.player == $scope.Players[i]._id)
                    thePlayer = $scope.Players[i].name;

            for (i = 0; i < $scope.Decks.length; i++)
                if (inObject.deckName == $scope.Decks[i]._id)
                    theDeck = $scope.fixName($scope.Decks[i].name);

            return $scope.fixName(thePlayer) + " playing " + $scope.fixName(theDeck);
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

gameControllers.controller("GameListController", ['$scope', '$http', '$location', function($scope, $http, $location){
    $http.get(CONFIG.server + 'query?coll=game').success(function (data)
    {
        $scope.Games = data;
    });

    $scope.fixName = function (inName)
    {
        return inName.replace(/\+/g, " ");
    };

    $scope.loadGame = function(inID)
    {
        $location.path("/game/" + inID);
    };

    $scope.convDate = function (inDate)
    {
        var oDate = Date.parse(inDate);
        var aDate = new Date(oDate);
        return aDate.toDateString();
    };
}]);