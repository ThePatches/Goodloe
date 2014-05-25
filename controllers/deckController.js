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
        var theItem = req.body.addedDeck;
        deckModel.simpleAdd(theItem, function(err, deck)
        {
            if (err)
            {
                res.send(500, err);
            } else {
                res.statusCode = 200;
                res.send(deck);
            }
        });
    }

    function Search(req, res) // This is kinda bogus
    {
        var inBody = req.body.inSearch;

        deckModel.advancedGet(inBody.query, inBody.fields, function(err, deck)
        {
            if (err)
            {
                res.send(500, err);
            } else {
                res.statusCode = 200;
                res.send(deck);
            }
        });
    }

    function Update(req, res)
    {
        var theItem = req.body.addedDeck;
        deckModel.simpleUpdate(theItem, function(err, deck)
        {
            if (err){
                res.send(500, err);
            } else {
                res.statusCode = 200;
                res.send(deck);
            }
        });

        res.send("not implemented!");
    }

    return {
      Get: Get,
      Add: Add,
      Search: Search,
      Update: Update
    };
};