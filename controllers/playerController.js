/**
 * Created by Patrick Taylor on 5/21/14.
 */

var url = require('url');

module.exports = function(playerModel)
{
    function Get(req, res)
    {
        var spaceUrl = req.url.replace(/\s/g,"%2B");
        var queryData = url.parse(spaceUrl, true).query;
        var findObject = {};

        if (queryData["id"])
        {
            findObject._id = queryData["id"];
        }

        playerModel.simpleGet(findObject, function(err, players)
        {
            if (err)
            {
                res.send(err);
            }
            else {
                res.send(players);
            }
        });
    }

    return {
        Get: Get
    };
};