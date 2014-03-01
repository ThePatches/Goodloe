/**
 * Created by Patrick Taylor on 2/26/14.
 */

angular.module('GameDirectives', [])
    .directive('addDeckToGame', function (){
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs)
            {
                $element.click(function(evt)
                {
                    var deckCrtl = $("#" + $attrs.deckCrtl);
                    var playerCrtl = $("#" + $attrs.playerCrtl);

                    if ($scope.selDeck == null || playerCrtl.val() == "")
                        return;

                    $scope.$apply(function ()
                    {
                        $scope.inDecks.push($scope.selDeck);
                        deckCrtl.children('option:selected').remove();
                        playerCrtl.children('option:selected').remove();
                        $scope.selDeck = null;
                    });
                });
            }]
        }
    });