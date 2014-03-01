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

                        $scope.inDecks.push({deck: $scope.selDeck, player: $scope.selPlayer, winner: false});
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
            controller: ['$scope', '$element', function($scope, $element)
            {
                $element.click(function (){
                    var addedGame = {};

                    addedGame.winType = $scope.winType;
                    addedGame.gameType = $scope.gameType;
                    addedGame.playedOn = Date.now();
                    addedGame.players = $scope.inDecks;

                    $scope.OutGame = addedGame;
                    $scope.$apply();
                });

            }]
        }
    })
;