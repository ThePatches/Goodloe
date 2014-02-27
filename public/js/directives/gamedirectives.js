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
                    $scope.$apply(function ()
                    {
                        $scope.inDecks.push($scope.selDeck);
                        $("#" + $attrs.deckCrtl).children('option:selected').remove();
                    });
                });
            }]
        }
    });