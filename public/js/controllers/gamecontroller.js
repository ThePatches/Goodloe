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
    $scope.editText = "Add Game";

    $scope.newGame = $routeParams.gameId == "new";

    // TODO: Make the resolving of deck names dependent on the loaded deck list.
    // OR: You can load the whole deck information through foreign keys?
    $http.get(CONFIG.server + 'query?coll=deck').success(function (data) // Need to get this to work parameterized
    {
        $scope.Decks = data;
        $http.get(CONFIG.server + 'query?coll=player').success(function (data) // Need to get this to work parameterized
        {
            $scope.Players = data;
            if (!$scope.newGame)
            {
                $http.get(CONFIG.server + "query?coll=game&id=" + $routeParams.gameId)
                    .success(function (data) {
                        $scope.inGame = data[0];
                        $scope.Description = $scope.inGame.description;
                        $scope.winType = $scope.inGame.winType;
                        $scope.gameType = $scope.inGame.gameType;
                        $scope.Story = $scope.inGame.story;
                        $scope.inDecks = [];
                        for (var i = 0; i < $scope.inGame.players.length; i++)
                        {
                            $scope.inDecks.push($scope.convFromDB($scope.inGame.players[i]));
                        }
                    });
            }
        });
    });

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
        $scope.editText = "Save";

        if ($scope.editGame == true)
            $scope.oldGame = $scope.inGame;
    };

    $scope.getDeckName = function(inDeck)
    {
        return $scope.fixName(inDeck.name) + " by " + $scope.fixName(inDeck.builder);
    };

    $scope.removeDeck = function (index)
    {
        $scope.inDecks.splice(index, 1);
    };

    $scope.getDescription = function(inObject)
    {
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

    $scope.convFromDB = function(inObject)
    {
        var anObject = {};

        anObject.deckName = inObject.deckName._id;
        anObject.player = inObject.player._id;
        anObject.winner = inObject.winner;

        return anObject;
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