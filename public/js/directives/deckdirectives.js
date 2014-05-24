/**
 * Created by Patrick Taylor on 5/24/14.
 */

angular.module('DeckDirectives', [])
    .directive("deckFilter", function()
    {
        return {
            restrict: "A",
            controller: ['$scope', '$element', function($scope, $element)
            {
                function parseDeck()
                {
                    var currentText = $element.val();

                    if (currentText.trim() === "")
                    {
                        $scope.showAll();
                    } else {

                        $scope.Decks = $.grep($scope.masterList, function(item)
                        {
                            return item.name.indexOf(currentText) > -1;
                        });
                    }

                    $scope.$apply();
                }

                $element.on('keyup change', parseDeck);
            }]
        };
    });