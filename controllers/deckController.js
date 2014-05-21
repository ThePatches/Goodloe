/**
 * Created by Patrick Taylor on 5/20/14.
 */

var url = require('url');

module.exports = function(deckModel)
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

        deckModel.simpleGet(findObject, function(err, decks)
        {
            if (err)
            {
                res.send(err);
            } else {
                res.send(decks);
            }
        });
    }

    function Add(req, res)
    {
        res.send("not implemented!");
    }

    return {
      Get: Get,
      Add: Add
    };
};