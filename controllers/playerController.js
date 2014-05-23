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

    function Add(req, res)
    {
        var aName = req.body.name;
        var theItem = {name: aName, games: 0, active: true, wins: 0};

        playerModel.simpleAdd(theItem, function(err, doc)
        {
           if (err)
            res.send(err);
           else {
               res.send(doc);
           }
        });
    }

    function Update(req, res)
    {
        var theItem = req.body.thePlayer;

        playerModel.simpleUpdate(theItem, function(err, doc)
        {
            if (err)
                res.send(err);
            else {
                res.send(doc);
            }
        });
    }

    return {
        Get: Get,
        Add: Add,
        Update: Update
    };
};