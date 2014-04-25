/**
 * Created by Patrick Taylor on 4/19/14.
 */

var userControllers = angular.module('userControllers', []);

userControllers.controller("LoginController", ['$scope', '$http', '$cookies', '$location', '$routeParams', function($scope, $http, $cookies, $location, $routeParams)
{
    $scope.userName = null;
    $scope.password = null;
    $scope.SomeStuff = $cookies.gookie ? JSON.parse($cookies.gookie).username : "None";
    $scope.Reason = $routeParams.reason;
    $scope.logOutMsg = "Log Out";

    if ($scope.Reason == "auth") // TODO: Expand this for other reasons?
    {
        $scope.SomeStuff = "You attempted to access a feature that requires you be logged in.";
        $scope.logOutMsg = "OK";
    }

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
                    $location.path('/').search('');
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
        $scope.logOutMsg = "Log Out";
    };
}]);

userControllers.controller("AddUserController", ['$scope', '$http', function($scope, $http) {
    $scope.username = null;
    $scope.password = null;
    $scope.adminRights = 1;
    $scope.isEncrypt = false;

    $scope.addUser = function()
    {
        var addUser = {username: $scope.username, pass: $scope.password, adminRights: $scope.adminRights, encrypt: $scope.isEncrypt};

        $http.post("/adduser", {addUser: addUser})
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

//userControllers.controller("ProfileController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location)
userControllers.controller("ProfileController", ['$scope', '$cookies', '$http', '$location', function($scope, $cookies, $http, $location)
{
    $scope.isMe = true;
    //$scope.inUser = {userName: "Dummy User", email: "someone@place.com"};
    $scope.newPass1 = null;
    $scope.newPass2 = null;

    $scope.inUser = JSON.parse($cookies.gookie);

    $scope.changePass = function()
    {
        if ($scope.newPass1 != $scope.newPass2)
        {
            $scope.errMsg = "Your passwords must match!";
            $scope.$apply();
        }
    };

    $scope.saveMe = function ()
    {
            $http.post('/update?coll=user', {inUser: $scope.inUser})
                .success(function (response)
                {
                    $scope.inUser = response;
                })
                .error(function (response)
                {
                   $scope.errMsg = response;
                });
    };

    $scope.doLogOut = function ()
    {
        $http.post('/logout');
        $location.path('/');
    };

}]);