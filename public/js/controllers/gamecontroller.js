/**
 * Created by Patrick Taylor on 2/23/14.
 */
var gameControllers = angular.module('gameControllers', []);

gameControllers.controller("GameController", ['$scope', '$routeParams', '$http', '$cookies', '$location',function($scope, $routeParams, $http, $cookies, $location)
{
    $scope.Decks = null;
    $scope.masterDeckList = null;
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
    $http.get('/deck/get').success(function (data) // Need to get this to work parameterized
    {
        $scope.masterDeckList = data;
        $http.get('/player/get').success(function (data) // Need to get this to work parameterized
        {
            $scope.Players = data;
            if (!$scope.newGame)
            {
                $http.get("/game/get?id=" + $routeParams.gameId)
                    .success(function (data) {
                        $scope.inGame = data[0];
                        $scope.Description = $scope.inGame.description;
                        $scope.winType = $scope.inGame.winType;
                        $scope.gameType = $scope.inGame.gameType;
                        $scope.Story = $scope.inGame.story;
                        $scope.Hours = ~~($scope.inGame.timePlayed / 60);
                        $scope.Minutes = $scope.inGame.timePlayed % 60;
                        $scope.inDecks = [];
                        for (var i = 0; i < $scope.inGame.players.length; i++)
                        {
                            $scope.inDecks.push($scope.convFromDB($scope.inGame.players[i]));
                        }

                        $scope.Decks = $scope.calcDeckList();
                    });
            }
        });
    });

    $scope.calcDeckList = function()
    {
        return $.grep($scope.masterDeckList, function(item)
        {
            var i;
            for (i = 0; i < $scope.inDecks.length; i++)
            {
                if (item._id == $scope.inDecks[i].deckName)
                    return false;
            }

            return true;
        });

    };

    /* @return boolean*/
    $scope.canEdit = function()
    {
        var myCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : null;

        return myCookie != null && myCookie.adminRights > 0;
    };

    /** @return string */
    $scope.HumanTime = function(totalMinutes) // This function is probably redundant
    {
        var retString;

        if (!totalMinutes)
            return "";

        var hours = ~~(totalMinutes / 60); // Oh, Javascript. You crazy.
        var minutes = totalMinutes % 60;

        retString = hours.toString() + " hours " + minutes.toString() + " minutes";

        return retString;
    };

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    $scope.toggleEdit = function ()
    {
        if ($scope.newGame)
        {
            $location.path('/games');
        }

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
        var value = $scope.inDecks.splice(index, 1);
        $scope.Decks.push(value);
    };

    $scope.getDescription = function(inObject) // TODO: convert these into better iterators?
    {
        var theDeck = null, thePlayer = null, i = 0;

        if (inObject.player != "none")
        {
            for (i = 0; i < $scope.Players.length; i++)
                if (inObject.player == $scope.Players[i]._id)
                    thePlayer = $scope.Players[i].name;

            for (i = 0; i < $scope.masterDeckList.length; i++)
                if (inObject.deckName == $scope.masterDeckList[i]._id)
                    theDeck = $scope.fixName($scope.masterDeckList[i].name);

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

gameControllers.controller("GameListController", ['$scope', '$http', '$location', '$cookies', function($scope, $http, $location, $cookies){
    $http.get('/game/list').success(function (data)
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

    /* @return boolean*/
    $scope.canEdit = function()
    {
        var myCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : null;

        return myCookie != null && myCookie.adminRights > 0;
    };
}]);