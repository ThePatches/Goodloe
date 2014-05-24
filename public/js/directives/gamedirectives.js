/**
 * Created by Patrick Taylor on 2/26/14.
 */

angular.module('GameDirectives', [])
    .directive('addDeckToGame', function () {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs)
            {
                $element.click(function()
                {
                    //var deckCrtl = $("#" + $attrs.deckCrtl);
                    var playerCrtl = $("#" + $attrs.playerCrtl);

                    if ($scope.selDeck == null || playerCrtl.val() == "")
                        return;

                    $scope.$apply(function ()
                    {
                        if ($scope.inDecks[0].player == "none")
                            $scope.inDecks = [];

                        $scope.inDecks.push({deckName: $scope.selDeck, player: $scope.selPlayer, winner: false});
                        //deckCrtl.children('option:selected').remove();
                        $scope.Decks = $scope.calcDeckList();
                        playerCrtl.children('option:selected').remove();
                        $scope.selDeck = null;
                        $scope.selPlayer = null;
                    });
                });
            }]
        }
    })

    .directive('addGame', function () {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$http', '$location', function($scope, $element, $http, $location)
            {
                var isWinner = false, i = 0;
                var theHours = 0, theMinutes = 0;

                $element.click(function (){

                    for (i = 0; i < $scope.inDecks.length; i++)
                    {
                        if ($scope.inDecks[i].winner)
                            isWinner = true;
                    }

                    if (!isWinner)
                    {
                        $("#messages").addClass("error");
                        $scope.OutGame = "You must pick a winner";
                        return;
                    }
                    $scope.$apply( function (){
                    if (!$scope.editGame)
                    {
                        var addedGame = {};


                        for (i = 0; i < $scope.inDecks.length; i++)
                        {
                            if ($scope.inDecks[i].winner)
                                isWinner = true;
                        }

                       addedGame.winType = $scope.winType;
                       addedGame.gameType = $scope.gameType;
                       addedGame.playedOn = Date.now();
                       addedGame.players = $scope.inDecks;
                       addedGame.description = $scope.Description;
                       addedGame.story = $scope.Story;

                        theHours = parseInt($scope.Hours) ? parseInt($scope.Hours) : 0;
                        theMinutes = parseInt($scope.Minutes) ? parseInt($scope.Minutes) : 0;

                       addedGame.timePlayed = theHours * 60 + theMinutes;

                       $("#messages").removeClass("error");
                       $scope.OutGame = addedGame;

                        $http({
                                url: "/game/add",
                                method: "POST",
                                data: {addedGame: addedGame},
                                headers: {'Content-type': 'application/json; charset=utf-8'}
                            }).success(function (data)
                                {
                                    //$scope.OutGame = data;
                                    $location.path('/game/' + data._id);
                                }).error(function (err)
                                {
                                    if (err == "Unauthorized")
                                        $location.path('/login').search({reason: "auth"});
                                    $scope.OutGame = "Something went wrong!";
                                });
                    }
                    else
                    {

                        var oldGame = $scope.oldGame;
                        var newGame = {};

                        if ($scope.gameType == "1v1" || oldGame.gameType == "1v1")
                        {
                            alert("You cannot edit games that are 1v1 (or change games into 1v1 type) in this version!");
                            return;
                        }

                        newGame.winType = $scope.winType;
                        newGame.gameType = $scope.gameType;
                        newGame.playedOn = Date.now();
                        newGame.players = $scope.inDecks;
                        newGame.description = $scope.Description;
                        newGame.story = $scope.Story;

                        theHours = parseInt($scope.Hours) ? parseInt($scope.Hours) : 0;
                        theMinutes = parseInt($scope.Minutes) ? parseInt($scope.Minutes) : 0;

                        newGame.timePlayed = theHours * 60 + theMinutes;

                        //newGame.timePlayed = parseInt($scope.Hours) * 60 + parseInt($scope.Minutes);

                        var reqBody = {};
                        reqBody.oldGame = oldGame;
                        reqBody.newGame = newGame;

                        $("#messages").removeClass("error");
                        $scope.OutGame = newGame;

                        $http({
                            url: "/game/update",
                            method: "POST",
                            data: {games: reqBody},
                            headers: {'Content-Type': 'application/json; charset=utf-8'}
                        }).success(function (data)
                            {
                                $scope.inGame = data;
                            }).error(function (err)
                            {
                                if (err == "Unauthorized")
                                {
                                    //alert("You are not logged in. You must be logged in to continue!");
                                    $location.path('/login').search({reason: "auth"});
                                }
                                $scope.OutGame = "Something went wrong!";
                            });
                    }

                    $scope.toggleEdit();
                    });
                });

            }]
        }
    })
;