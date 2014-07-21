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

        if (queryData.id)
        {
            findObject._id = queryData.id;
        }

        deckModel.simpleGet(findObject, function(err, decks)
        {
            sendResponse(res, err, decks);
        });
    }

    function Add(req, res)
    {
        var theItem = req.body.addedDeck;
        deckModel.simpleAdd(theItem, function(err, deck)
        {
            sendResponse(res, err, deck);
        });
    }

    function Search(req, res) // This is kinda bogus
    {
        var inBody = req.body.inSearch;

        deckModel.advancedGet(inBody.query, inBody.fields, function(err, deck)
        {
           sendResponse(res, err, deck);
        });
    }

    function Update(req, res)
    {
        var theItem = req.body.addedDeck;
        deckModel.simpleUpdate(theItem, function(err, deck)
        {
            sendResponse(res, err, deck);
        });

        //res.send("not implemented!");
    }

    function sendResponse(res, err, deck)
    {
        if (err)
        {
            res.statusCode = 500;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(deck);
        }
    }

    return {
      Get: Get,
      Add: Add,
      Search: Search,
      Update: Update
    };
};