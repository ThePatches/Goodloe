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

        if (queryData.id)
        {
            findObject._id = queryData.id;
        }

        playerModel.simpleGet(findObject, function(err, players)
        {
            sendResponse(res, err, players);
        });
    }

    function Add(req, res)
    {
        var aName = req.body.name;
        var theItem = {name: aName, games: 0, active: true, wins: 0};

        playerModel.simpleAdd(theItem, function(err, doc)
        {
           sendResponse(res, err, doc);
        });
    }

    function Update(req, res)
    {
        var theItem = req.body.thePlayer;

        playerModel.simpleUpdate(theItem, function(err, doc)
        {
            sendResponse(res, err, doc);
        });
    }

    function sendResponse(res, err, doc)
    {
        if (err)
        {
            res.statusCode = 500;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(doc);
        }
    }

    return {
        Get: Get,
        Add: Add,
        Update: Update
    };
};