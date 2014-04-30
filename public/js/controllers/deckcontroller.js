/**
 * Created by Patrick Taylor on 2/17/14.
 */

var deckControllers = angular.module('deckControllers', []);

deckControllers.controller('DeckController', ['$scope', '$routeParams','$http', '$cookies', '$location', function ($scope, $routeParams, $http, $cookies, $location)
{
    $scope.deckId = $routeParams.deckId;
    $scope.doEdit = false;
    $scope.ButtonText = $scope.deckId == "new" ? "Add Deck" : "Update Deck";

    $scope.fixName = function (inName)
    {
        if (inName)
            return inName.replace(/\+/g, " ");
        else
            return "";
    };

    $scope.isEditing = function()
    {
      return ($scope.deckId == 'new' || $scope.doEdit == true);
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

    $scope.buildObject = function()
    {
        var retObject = {name: $scope.Deck.name.replace(/\s/g, "+"), color: encodeURIComponent($scope.Deck.color), builder: $scope.Deck.builder.replace(/\s/g, "+"),
        commander: $scope.Deck.commander.replace(/\s/g, '+')}
        if ($scope.deckId != "new")
            retObject._id = $scope.Deck._id;

        return retObject;
    }

    /** @return boolean */
    $scope.CheckCookie = function()
    {
        var theCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : "None";

        if (theCookie == "None")
            return false;

        return (theCookie.username && theCookie.username != "");
    };

    $scope.addDeck = function()
    {
        var addedDeck = $scope.buildObject();

        if ($scope.deckId == "new")
        {
            $http({
                url: "/add?coll=deck",
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
                url: "/update?coll=deck",
                method: "POST",
                data: {addedDeck: addedDeck},
                headers: {'Content-type': 'application/json; charset=utf-8'}
            }).success(function (data)
                {
                    //$scope.OutGame = data;
                    $scope.toggleEdit();
                }).error(function (err)
                {
                    $scope.OutGame = "Something went wrong! " + err;
                });
        }
    };

    $scope.parseList = function(inText)
    {
        var masterList = [];
        var i;
        var tempList = inText.split("\n");
        var itemArray = null;

        for (i = 0; i < inText.length; i++)
        {
            itemArray = tempList[i].split("x").trim();
            masterList.append({card: itemArray[0], count: parseInt(itemArray[1])});
        }
    };

    if ($scope.deckId != 'new')
    {
        $http.get('/query?coll=deck&id=' + $scope.deckId).success(function (data) {
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

deckControllers.controller('DeckListController', ['$scope', '$http', '$location', '$cookies',
    function($scope, $http, $location, $cookies) {

        $scope.groupField = null;

        $http.get('/query?coll=deck').success(function (data) // Need to get this to work parameterized
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

        $scope.canEdit = function()
        {
            var myCookie = $cookies.gookie ? JSON.parse($cookies.gookie) : null;

            return myCookie != null && myCookie.adminRights > 0;
        };

        // TODO: Add $scope.$watch(groupField) that organizes the deck list into groups
}]);