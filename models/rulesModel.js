/**
 * Created by Patrick Taylor on 5/26/14.
 */

module.exports = function(connection)
{
    var SCHEMAS = require('./schemas.js');
    var  BannedModel = connection.model("BannedModel", SCHEMAS.BannedListSchema, "BannedList");

    return {
        addCard: function(inCard, callback)
        {
            var card = new BannedModel(inCard);

            card.save(function(err, card)
            {
               if (err)
               {
                   callback(err, null);
               } else {
                   callback(null, card);
               }
            });
        },

        getBannedList: function(findObject, callback)
        {
            BannedModel.find(findObject, "cardname gatherer reason date status votes", function(err, list)
            {
                if (err)
                    callback(err, null);
                else
                    callback(null, list);
            });
        },

        vote: function(inCard, callback)
        {
            BannedModel.update({_id: inCard}, {$inc: {votes: 1}}, {multi: false}, function(err, numAffected)
            {
               if (numAffected > 0)
               {
                   callback(null, "valid")
               } else {
                   callback(err, null);
               }
            });
        }
    };
};