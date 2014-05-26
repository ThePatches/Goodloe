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

    return {
        getBannedList: Get,
        addACard: addACard
    };
};