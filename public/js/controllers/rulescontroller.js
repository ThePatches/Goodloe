/**
 * Created by Patrick Taylor on 5/26/14.
 */

var rulesControllers = angular.module('rulesControllers', []);

rulesControllers.controller("RulesController",['$scope', function($scope){
    $scope.Title = "Rules";
}]);

rulesControllers.controller("BannedListController", ['$scope', '$http', function($scope, $http)
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
    };

    $scope.Cancel = function()
    {
        $location.path("/");
    };
}]);