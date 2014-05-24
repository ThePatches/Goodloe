/**
 * Created by Patrick Taylor on 5/23/14.
 */

var url = require('url');

module.exports = function(gameModel)
{
    function listGet(req, res)
    {
         gameModel.listGet(function(err, games)
         {
             if (!err)
             {
                 res.send(games);
             }
         });
    }

    function simpleGet(req, res)
    {
        var spaceUrl = req.url.replace(/\s/g,"%2B");
        var queryData = url.parse(spaceUrl, true).query;
        var findObject = {};

        if (queryData["id"])
        {
            findObject._id = queryData["id"];
        }

        gameModel.simpleGet(findObject, function(err, games)
        {
            if (err)
            {
                res.statusCode = 500;
                res.send(err);
            } else {
                res.statusCode = 200;
                res.send(games);
            }
        });
    }

    function simpleAdd(req, res)
    {
        var theItem = req.body.addedGame;
        gameModel.simpleAdd(theItem, function(err, product)
        {
            if (err)
            {
                res.statusCode = 500;
                res.send(err);
            } else {
                res.statusCode = 200;
                res.send(product);
            }
        });
    }

    function simpleUpdate(req, res)
    {
        var theItem = req.body.games;

        gameModel.simpleUpdate(theItem.oldGame, theItem.newGame, function(err, game)
        {
            if (err)
            {
                res.statusCode = 500;
                res.send(err);
            } else {
                res.statusCode = 200;
                res.send(game);
            }
        });
    }

    return     {
        getList: listGet,
        simpleGet: simpleGet,
        simpleAdd: simpleAdd,
        simpleUpdate: simpleUpdate
    };
};