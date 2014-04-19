/**
 * Created by Patrick Taylor on 4/19/14.
 */

var userControllers = angular.module('userControllers', []);

userControllers.controller("LoginController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location)
{
    $scope.userName = null;
    $scope.password = null;
    $scope.SomeStuff = $cookies.gookie ? JSON.parse($cookies.gookie).username : "None";

    $scope.DoLogin = function()
    {
        $http.post("/login", {username: $scope.userName, password: $scope.password})
            .success(function(user)
            {
                if (user)
                {
                    $scope.SomeStuff = user.username;

                    $scope.userName = "";
                    $scope.password = "";
                    $location.path('/');
                }
                else
                {
                    $scope.SomeStuff = "failed login!";
                }
            }).error(function ()
            {
                $scope.SomeStuff = "failed login!";
            });
    };

    $scope.DoLogOut = function ()
    {
        $http.post("/logout");
        $scope.SomeStuff = "None";
    };
}]);

userControllers.controller("AddUserController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    $scope.username = null;
    $scope.password = null;
    $scope.adminRights = 1;
    $scope.isEncrypt = false;

    $scope.addUser = function()
    {
        var addUser = {username: $scope.username, pass: $scope.password, adminRights: $scope.adminRights, encrypt: $scope.isEncrypt};

        $http.post(CONFIG.server + "adduser", {addUser: addUser})
            .success(function (response)
            {
                $scope.OutMessage = response;
            })
            .error(function(response)
            {
                $scope.OutMessage = response;
            });
    };

}]);