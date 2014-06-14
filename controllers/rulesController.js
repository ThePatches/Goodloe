/**
 * Created by Patrick Taylor on 5/26/14.
 */

var url = require('url');

module.exports = function(rulesModel)
{
    function Get(req, res)
    {
        var findObject = {};

        rulesModel.getBannedList(findObject, function(err, list)
        {
            if (err)
            {
                res.statusCode = 500;
                res.send(err);
            } else {
                res.statusCode = 200;
                res.send(list);
            }
        });
    }

    function addACard(req, res)
    {
        var inCard = req.body.addedCard;

        rulesModel.addCard(inCard, function(err, card)
        {
            if (err)
            {
                res.statusCode = 500;
                res.send(err);
            } else {
                res.statusCode = 200;
                res.send(card);
            }
        });
    }

    function Vote(req, res)
    {
        var queryData = url.parse(req.url, true).query;
        var inCard = queryData.id;
        console.log("Id:" + inCard);
        rulesModel.vote(inCard, function(err, msg)
        {
            console.log(err === null);
            if (err)
            {
                console.log(err);
                res.statusCode = 500;
                res.send(err);
            } else {
                res.statusCode = 200;
                res.send(msg);
            }
        });
    }

    function Update(req, res)
    {
        var theCard = req.body.theCard;
        rulesModel.update(theCard, function(err, card)
        {
            sendResponse(res, err, card);
        });
    }

    function sendResponse(res, err, card)
    {
        if (err)
        {
            console.log(err);
            res.statusCode = 500;
            res.send(err);
        } else {
            res.statusCode = 200;
            res.send(card);
        }
    }

    return {
        getBannedList: Get,
        addACard: addACard,
        Vote: Vote,
        Update: Update
    };
};