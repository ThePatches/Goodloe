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
        return card.pending && $cookieStore[CONFIG.cookieName].adminRights > 1;
    };

    $scope.banCard = function(card)
    {
        alert(card.status);
    };
}]);

rulesControllers.controller("BanCardController", ['$scope', '$http', '$location', function($scope, $http, $location)
{
    $scope.canBan = true;
    $scope.cardName = null;
    $scope.gatherer = null;
    //$scope.canSubmit = true;

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
            })
        ; // TODO: Add success and failure to this callback
    };

    $scope.Cancel = function()
    {
        $location.path("/");
    };
}]);