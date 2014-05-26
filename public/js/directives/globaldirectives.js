/**
 * Created by Patrick Taylor on 5/26/14.
 */

angular.module("GlobalDirectives", [])
    .directive("clearInputs", function()
    {
        return {
            restrict: "A",
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs)
            {
                var clearDivId = $attrs.formDiv;
                $element.click(function()
                {
                    $("#" + clearDivId + "> input").each(function ()
                    {
                        $(this).val("");
                    });

                    $("#" + clearDivId + ">textarea").each(function ()
                    {
                        $(this).val("");
                    });
                });
            }]
        };
    })

    .directive("patchExpander", function()
    {
        return {
            restrict: "A",
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs)
            {
                var parentElement = $element.parent();
                var list = parentElement.find("ul");

                $element.click(function ()
                {
                    if (list.is(":visible"))
                        list.css("display", "none");
                    else
                        list.css("display", "block");
                });

                $element.ready(function ()
                {
                    if ($attrs.patchIndex > 0)
                        list.css("display", "none");
                });
            }]
        };
    })
;