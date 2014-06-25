/**
 * Created by Patrick Taylor on 5/26/14.
 */

var rulesControllers = angular.module('rulesControllers', []);

rulesControllers.controller("RulesController",['$scope', function($scope){
    $scope.Title = "Rules";
}]);

rulesControllers.controller("BannedListController", ['$scope', '$http', '$window', '$cookieStore', function($scope, $http, $window, $cookieStore)
{
    $scope.bannedCards = null;
    $scope.anError = null;

    $http.get("/banned/get")
        .success(function(data)
        {
            $scope.bannedCards = data;
            reMakeList();

        }).error(function(err)
        {
            if (err.statusCode == 500)
            {
                $scope.anError = "Something went wrong. Contact the system administrator";
            }
        });

    $scope.isError = function()
    {
        return $scope.anError !== null;
    };

    $scope.viewCard = function(url)
    {
        $window.open(url);
    };

    $scope.hasRights = function(card)
    {

        return card.status === "pending" && $cookieStore.get(CONFIG.cookieName) && $cookieStore.get(CONFIG.cookieName).adminRights > 1;
    };

    $scope.banCard = function(card)
    {
        card.status = "banned";

        $http.post("/banned/ban", {theCard: card})
            .success(function()
            {
                reMakeList();
            })
            .error(function(err)
            {
                if (err.statusCode == 500)
                {
                    $scope.anError = "Something went wrong. Contact the system administrator.";
                }
            });
    };

    function reMakeList()
    {
        $scope.isBanned = $.grep($scope.bannedCards, function(item)
        {
            return item.status == "banned";
        });

        $scope.isPending = $.grep($scope.bannedCards, function(item)
        {
            return item.status == "pending";
        });
    }

    $scope.Vote = function(inCard)
    {
        $http.get('/banned/vote?id=' + inCard)
            .success(function(outCard)
            {
                $scope.bannedCards = $.map($scope.bannedCards, function(n)
                {
                    if (n._id == inCard)
                    {
                        n.votes++;
                    }

                    return n;
                });
            }).error(function(err)
            {
                if (err.statusCode == 500)
                {
                    $scope.anError = "Something went wrong. Contact the system administrator.";
                }
            });
    };
}]);

rulesControllers.controller("BanCardController", ['$scope', '$http', '$location', function($scope, $http, $location)
{
    $scope.canBan = true;
    $scope.cardName = null;
    $scope.gatherer = null;

    $scope.submitBan = function()
    {
        var newCard = {};
        newCard.cardname = $scope.cardName;
        newCard.gatherer = $scope.gatherer;
        newCard.reason = $scope.reason;

        newCard.status = "pending";
        newCard.votes = 0;

        $http.post("/banned/add", {addedCard: newCard})
            .success(function()
            {
                $scope.canBan = false;
                $scope.message = "Your suggested ban has been submitted.";
            })
            .error(function (err)
            {
                $scope.message = "Something went wrong: " + err + " contact the system administrator";
            });
    };

    $scope.Cancel = function()
    {
        $location.path("/");
    };
}]);