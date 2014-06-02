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
}]);