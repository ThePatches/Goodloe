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
                    var deckCrtl = $("#" + $attrs.deckCrtl);
                    var playerCrtl = $("#" + $attrs.playerCrtl);

                    if ($scope.selDeck == null || playerCrtl.val() == "")
                        return;

                    $scope.$apply(function ()
                    {
                        if ($scope.inDecks[0].player == "none")
                            $scope.inDecks = [];

                        $scope.inDecks.push({deckName: $scope.selDeck, player: $scope.selPlayer, winner: false});
                        deckCrtl.children('option:selected').remove();
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

                       $("#messages").removeClass("error");
                       $scope.OutGame = addedGame;

                        $http({
                                url: CONFIG.server + "add?coll=game",
                                method: "POST",
                                data: {addedGame: addedGame},
                                headers: {'Content-type': 'application/json; charset=utf-8'}
                            }).success(function (data)
                                {
                                    //$scope.OutGame = data;
                                    $location.path('/game/' + data._id);
                                }).error(function (err)
                                {
                                    $scope.OutGame = "Something went wrong!";
                                });
                    }
                    else
                    {
                        var oldGame = $scope.oldGame;
                        var newGame = {};

                        newGame.winType = $scope.winType;
                        newGame.gameType = $scope.gameType;
                        newGame.playedOn = Date.now();
                        newGame.players = $scope.inDecks;
                        newGame.description = $scope.Description;
                        newGame.story = $scope.Story;

                        var reqBody = {};
                        reqBody.oldGame = oldGame;
                        reqBody.newGame = newGame;

                        $("#messages").removeClass("error");
                        $scope.OutGame = newGame;

                        $http({
                            url: CONFIG.server + "update?coll=game",
                            method: "POST",
                            data: {games: reqBody},
                            headers: {'Content-Type': 'application/json; charset=utf-8'}
                        }).success(function (data)
                            {
                                $scope.inGame = data;
                            }).error(function (err)
                            {
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