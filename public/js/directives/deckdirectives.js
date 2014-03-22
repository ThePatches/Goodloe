/**
 * Created by Patrick Taylor on 3/14/14.
 */
angular.module("DeckDirectives", [])
    .directive("deckFilter", function () {
        return {
            restrict: "E",
            templateUrl: "/js/directives/deckfilter.html",
            link: function (scope, element)
            {

            }
        }
    });