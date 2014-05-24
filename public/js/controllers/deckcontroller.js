/**
 * Created by Patrick Taylor on 2/17/14.
 */

var deckControllers = angular.module('deckControllers', []);

deckControllers.controller('DeckController', ['$scope', '$routeParams','$http', '$cookies', '$location', function ($scope, $routeParams, $http, $cookies, $location)
{
    $scope.deckId = $routeParams.deckId;
    $scope.doEdit = false;
    $scope.ButtonText = $scope.deckId == "new" ? "Add Deck" : "Update Deck";
    $scope.showDeckList = false;
    $scope.ListButtonText = "Show Deck List";

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    $scope.isEditing = function()
    {
      return ($scope.deckId == 'new' || $scope.doEdit === true);
    };

    $scope.toggleEdit = function ()
    {
        $scope.doEdit = !$scope.doEdit;
    };

    $scope.cancelEdit = function ()
    {
        if ($scope.deckId == "new")
        {
            $location.path('/decks');
        }
        else
            $scope.toggleEdit();
    };

    $scope.toggleDeckList = function()
    {
        $scope.showDeckList = !$scope.showDeckList;
        $scope.ListButtonText = $scope.showDeckList ? "Hide Deck List" : "Show Deck List";
    };

    $scope.buildObject = function()
    {
        var retObject = {name: $scope.Deck.name, color: $scope.Deck.color, builder: $scope.Deck.builder,
        commander: $scope.Deck.commander, deckList: $scope.parseDeck()};

        if ($scope.deckId != "new")
            retObject._id = $scope.Deck._id;

        return retObject;
    };

    /** @return boolean */
    $scope.CheckCookie = function()
    {
        var theCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : "None";

        if (theCookie == "None")
            return false;

        return (theCookie.username && theCookie.username !== "");
    };

    function parseCard(inString)
    {
        var pattern = /\sx\s\d{1,2}/ig;
        var theMatch = pattern.exec(inString);
        var card, qty;

        if (theMatch !== null)
        {
            card = inString.substring(0, inString.indexOf(theMatch)).trim();
            qty = parseInt(theMatch[0].split('x')[1].trim());
        }
        else
        {
            throw "Incorrect Format";
        }

        var object = {card: "", qty: 0};
        object.card = card;
        object.qty = qty;

        return object;
    }

    $scope.doParse = function()
    {
        $scope.SomeCards = $scope.parseDeck();
    };

    $scope.parseDeck = function()
    {
            if (!$scope.Deck.deckList || $scope.Deck.deckList === "")
            {
            var cardList = $scope.Deck.deckList.split("\n");
            var i = 0;

            try
            {
                var someCards = [];
                for (i = 0; i < cardList.length; i++)
                {
                    someCards.push(parseCard(cardList[i]));
                }

                $scope.ErrMsg = "";

                return someCards;
            }
            catch (ex)
            {
                $scope.ErrMsg = ex + " at line " + (i + 1);
            }
        }

        return [];
    };

    $scope.addDeck = function()
    {
        var addedDeck = $scope.buildObject();

        if ($scope.deckId == "new")
        {
            $http({
                url: "/deck/add",
                method: "POST",
                data: {addedDeck: addedDeck},
                headers: {'Content-type': 'application/json; charset=utf-8'}
            }).success(function (data)
                {
                    $location.path('/deck/' + data._id);
                }).error(function (err)
                {
                    $scope.OutGame = "Something went wrong! " + err;
                });
        }
        else
        {
            $http({
                url: "/deck/update",
                method: "POST",
                data: {addedDeck: addedDeck},
                headers: {'Content-type': 'application/json; charset=utf-8'}
            }).success(function ()
                {
                    //$scope.OutGame = data;
                    $scope.toggleEdit();
                }).error(function (err)
                {
                    $scope.OutGame = "Something went wrong! " + err;
                });
        }
    };

    if ($scope.deckId != 'new')
    {
        $http.get('/deck/get?id=' + $scope.deckId).success(function (data) {
            if (data != "no deck returned")
            {
                $scope.Deck = data[0];

                // Now, create the deckList
                var textDeck = "";

                for (var i = 0; i < data[0].deckList.length; i++)
                {
                    textDeck = textDeck + data[0].deckList[i].card + " x " + data[0].deckList[i].qty + "\n";
                }

                $scope.Deck.deckList = textDeck;
            }
        });

    }
    else
    {
        $scope.Deck = {name : "", builder: "", color: ""};
    }
}]);

deckControllers.controller('DeckListController', ['$scope', '$http', '$location', '$cookies',
    function($scope, $http, $location, $cookies) {

        $scope.groupField = null;
        $scope.Decks = null;
        $scope.masterList = null;
        $scope.Colors = [{name: "White", symbol: "W", selected: false},
            {name: "Blue", symbol: "U", selected: false},
            {name: "Black", symbol: "B", selected: false},
            {name: "Red", symbol: "R", selected: false},
            {name: "Green", symbol: "G", selected: false}
        ];
        $scope.Decks = null;

        $http.get('/deck/get').success(function (data) // Need to get this to work parameterized
        {
            $scope.masterList = data;
            $scope.showAll();
        });

        $scope.fixName = function (inName)
        {
            return inName.replace(/\+/g, " ");
        };

        $scope.loadDeck = function(inID)
        {
            $location.path("/deck/" + inID);
        };

        $scope.colorFilter = function(inColor)
        {
            $scope.Decks = $.grep($scope.masterList, function(item)
            {
                return item.color.indexOf(inColor) > -1;
            });
        };

        $scope.showAll = function()
        {
            $scope.Decks = $scope.masterList;
        };

        $scope.canEdit = function()
        {
            var myCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : null;

            return myCookie !== null && myCookie.adminRights > 0;
        };
}]);